package com.qhl.server.websocket;

import com.sinochem.yunlian.truck.common.constant.CodeStatus;
import com.sinochem.yunlian.truck.common.msg.ObjectRestResponse;
import com.sinochem.yunlian.truck.ucenterinf.feign.UcTokenFeign;
import com.sinochem.yunlian.truck.ucenterinf.vo.token.UcTokenWebsocketVo;
import com.sinochem.yunlian.truck.websocket.domain.UserSocket;
import com.sinochem.yunlian.truck.websocket.utils.SpringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Date;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by qjm on 2018/7/6
 */

@Slf4j
@ServerEndpoint(value = "/websocket/user/{accessToken}")
@Component
@EnableScheduling
public class WebSocketUserServer {

    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static AtomicInteger onlineCount = new AtomicInteger(0);
    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArrayList<UserSocket> userSockets = new CopyOnWriteArrayList<>();
    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    /*
    连接打开时执行
     */
    @OnOpen
    public void onOpen(@PathParam("accessToken") String accessToken , Session session) {

        open:{
            addOnlineCount();           //在线数加1
            this.session = session;
            log.info("WebSocketUserServer 有新连接加入！当前在线人数为" + getOnlineCount());

            if(accessToken ==null || "".equals(accessToken)){
                log.info("WebSocketUserServer onOpen accessToken is null");
                closeSession(session);
                break open;
            }
            //校验accessToken,获取user信息
            //获取service方法
            UcTokenFeign ucTokenFeign = SpringUtil.getBean(UcTokenFeign.class) ;
            ObjectRestResponse<UcTokenWebsocketVo> userResult = ucTokenFeign.getUserInfo(accessToken) ;
            if(userResult.getStatus() != CodeStatus.CODE_SUCCESS.getValue()
                    ||userResult.getData() == null){
                log.info("WebSocketUserServer onOpen token feign not success:"+userResult.getMsg());
                closeSession(session);
                break open;
            }

            //添加到用户Session对应关系中
            UserSocket userSocket = new UserSocket();
            userSocket.setUserId(userResult.getData().getUserId());
            userSocket.setOs(userResult.getData().getOs());
            userSocket.setBusinessType(userResult.getData().getBusinessType());
            userSocket.setWebSocketUserServer(this);
            userSockets.add(userSocket) ;

//            try {
//                sendMessage("server连接成功");
//            } catch (IOException e) {
//                log.error("websocket IO异常");
//            }
            log.info("WebSocketUserServer Connected ... " + session.getId());
        }

    }

    /*
    服务端不接收非合规的client，进行关闭操作
     */
    private void closeSession(Session session){
        try {
            session.close();
        } catch (IOException e) {
            log.error("WebSocketUserServer close error:"+e);
            e.printStackTrace();
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        subOnlineCount();           //在线数减1
        log.info("WebSocketUserServer 有一连接关闭！当前在线人数为" + getOnlineCount());

        userSockets.stream()
                .forEach(u ->{
                    if(u.getWebSocketUserServer() == this){
                        userSockets.remove(u) ;
                        log.info("WebSocketUserServer userSockets remove user socket,user:"+u.getUserId());
                    }
                } );

        log.info("WebSocketUserServer 删除关闭连接的对应关系");
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("WebSocketUserServer 来自客户端的消息:" + message);

//        //群发消息
//        for (WebSocketUserServer item : webSocketSet) {
//            try {
//                item.sendMessage(message);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
    }

    /**
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("WebSocketUserServer 发生错误:"+error);
        error.printStackTrace();
    }

    /*
     给客户端发送文本信息
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
        log.info("WebSocketUserServer sendMessage:"+message);
    }

    /*
    发送用户状态信息
     */
    public void sendUserPushMsgInfo(String status) throws IOException{
        this.session.getBasicRemote().sendText(status);
        log.info("WebSocketUserServer sendUserPushMsgInfo:"+status);
    }

    /*
    根据userID，os,businessType 给客户端推送用户状态
     */
    public static void PushMsgInfoToUser(String userId,String os
            ,String businessType,String status) throws IOException {
        if(status !=null && !"".equals(status)){
            userSockets.stream()
                    .forEach(u->{
                        if(u.getUserId().equals(userId) && u.getOs().equals(os)
                                &&u.getBusinessType().equals(businessType)){
                            try {
                                u.getWebSocketUserServer().sendUserPushMsgInfo(status);
                                log.info("WebSocketUserServer PushMsgInfoToUser success,userId:"+userId);
                            } catch (IOException e) {
                                e.printStackTrace();
                                log.error("WebSocketUserServer PushMsgInfoToUser error,userId:"+userId);
                            }
                        }
                    });
        }

    }

    /*
    定时检查存活的Session，如果未存活进行处理
     */
    @Scheduled(cron = "0 0 0/2 * * ?")
    public static void checkAliveSession(){
        log.info("WebSocketUserServer checkAliveSession start:"+new Date());
        userSockets.stream()
                .forEach(u->{
                    if(!u.getWebSocketUserServer().session.isOpen()){
                        userSockets.remove(u) ;
                        log.info("WebSocketUserServer checkAlive remove not open session,userId:"+u.getUserId());
                    }
                });
        log.info("WebSocketUserServer checkAliveSession end:"+new Date());
    }

    /*
     群发自定义消息
     */
//    public static void sendMessageToAll(String message) throws IOException {
//        log.info(message);
//        for (WebSocketUserServer item : webSocketSet) {
//            try {
//                item.sendMessage(message);
//            } catch (IOException e) {
//                continue;
//            }
//        }
//    }

    /*
     定时群发消息
     */
//    public static void sendSchMsgToALL(String message) throws IOException {
//        log.info("发送定时信息start，时间："+new Date());
//        schCount.getAndIncrement() ;
//        Gson gson = new Gson();
//        userSockets.stream()
//                .forEach(u->{
//                    try {
//                        ArrayList<DataObject> msgList = new ArrayList<>() ;
//                        for(String key : Datas.datas.keySet()){
//                            ArrayList<DataObject> list = Datas.datas.get(key) ;
//                            int index = schCount.get()%list.size() ;
//                            msgList.add(Datas.datas.get(key).get(index));
//                        }
////                        u.getWebSocketServer().sendMessage("hello "+u.getUserId()
////                                +",I am server Scheduled message;"+message);
//
//                        u.getWebSocketUserServer().sendMessage(gson.toJson(msgList));
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                        log.error("server Scheduled send msg to client io error,userId:"+u.getUserId());
//                    }
//                });
//        log.info("发送定时信息end，时间："+new Date());
//    }



    public static synchronized int getOnlineCount() {
        return onlineCount.get();
    }

    public static synchronized void addOnlineCount() {
        WebSocketUserServer.onlineCount.getAndIncrement();
    }

    public static synchronized void subOnlineCount() {
        WebSocketUserServer.onlineCount.getAndDecrement();
    }
}

