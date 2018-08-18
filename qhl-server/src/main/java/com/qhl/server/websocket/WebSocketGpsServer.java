package com.qhl.server.websocket;

import com.sinochem.yunlian.truck.api.vo.fleet.SocketCompanyDTO;
import com.sinochem.yunlian.truck.common.constant.CodeStatus;
import com.sinochem.yunlian.truck.common.constant.RedisKey;
import com.sinochem.yunlian.truck.common.msg.ObjectRestResponse;
import com.sinochem.yunlian.truck.ucenterinf.feign.UcTokenFeign;
import com.sinochem.yunlian.truck.ucenterinf.vo.token.UcTokenWebsocketVo;
import com.sinochem.yunlian.truck.websocket.domain.GpsCompanyInfo;
import com.sinochem.yunlian.truck.websocket.domain.GpsPushInfo;
import com.sinochem.yunlian.truck.websocket.domain.GpsSocket;
import com.sinochem.yunlian.truck.websocket.feign.GpsServiceFeign;
import com.sinochem.yunlian.truck.websocket.utils.SpringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by qjm on 2018/7/12
 */
@Slf4j
@ServerEndpoint("/websocket/gps/{accessToken}")
@Component
@EnableScheduling
public class WebSocketGpsServer {

    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static AtomicInteger onlineCount = new AtomicInteger(0);

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArrayList<GpsSocket> gpsSockets = new CopyOnWriteArrayList<>();

    //连接打开时执行
    @OnOpen
    public void onOpen(@PathParam("accessToken") String accessToken , Session session) {

        open:{
            addOnlineCount();           //在线数加1
            log.info("WebSocketGpsServer 有新连接加入！当前在线人数为" + getOnlineCount());

            if(accessToken ==null || "".equals(accessToken)){
                log.info("WebSocketGpsServer onOpen accessToken is null");
                closeSession(session);
                break open;
            }
            //校验accessToken,获取user信息
            UcTokenFeign ucTokenFeign = SpringUtil.getBean(UcTokenFeign.class) ;
            ObjectRestResponse<UcTokenWebsocketVo> userResult = ucTokenFeign.getUserInfo(accessToken) ;
            if(userResult.getStatus() != CodeStatus.CODE_SUCCESS.getValue()
                    ||userResult.getData() == null){
                log.info("WebSocketGpsServer onOpen token feign not success:"+userResult.getMsg());
                closeSession(session);
                break open;
            }

            //redis维护请求GPS数据的用户,增加该用户的请求渠道次数+1
            String key = RedisKey.WEBSOCKET_GPS_USER
                    + "@"+userResult.getData().getBusinessType()
                    +"@"+userResult.getData().getCompanyId() ;
            RedisTemplate<String, Object> redisTemplate = SpringUtil.getBean("redisTemplate",RedisTemplate.class);
            if(redisTemplate.hasKey(key)){
                log.info("WebSocketGpsServer onOpen redis have exist this key:"+key);
                redisTemplate.opsForValue().increment(key,1) ;
            }else{
                //notify gps websocket add company
                List<SocketCompanyDTO> socketCompanys = new ArrayList<>() ;
                SocketCompanyDTO dto = new SocketCompanyDTO() ;
                dto.setCompanyId(userResult.getData().getCompanyId());
                dto.setCompanyType(userResult.getData().getBusinessType());
                socketCompanys.add(dto);
                GpsServiceFeign gpsServiceFeign = SpringUtil.getBean(GpsServiceFeign.class) ;
                ObjectRestResponse gpsResult = gpsServiceFeign.addCompany(socketCompanys) ;
                if(gpsResult.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                    log.info("WebSocketGpsServer onOpen feign gps websocket not success ,try again");
                    ObjectRestResponse gpsResult2 = gpsServiceFeign.addCompany(socketCompanys) ;
                    if(gpsResult2.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                        log.error("WebSocketGpsServer onOpen feign gps websocket error:"+gpsResult.getMsg());
                        closeSession(session);
                        break open;
                    }
                }
                log.info("WebSocketGpsServer onOpen redis first save this key:"+key);
                redisTemplate.opsForValue().set(key,1);
                log.info("WebSocketGpsServer onOpen feign addCompany success,companyId:"
                        +userResult.getData().getCompanyId());
            }

            this.session = session;
            //添加到用户Session对应关系中
            GpsSocket gpsSocket = new GpsSocket();
            gpsSocket.setUserId(userResult.getData().getUserId());
            gpsSocket.setOs(userResult.getData().getOs());
            gpsSocket.setBusinessType(userResult.getData().getBusinessType());
            gpsSocket.setCompanyId(userResult.getData().getCompanyId());
            gpsSocket.setWebSocketGpsServer(this);
            gpsSockets.add(gpsSocket) ;

//            try {
//                sendMessage("server连接成功");
//            } catch (IOException e) {
//                log.error("websocket IO异常");
//            }
            log.info("WebSocketGpsServer Connected ... " + session.getId());
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

    /*
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        subOnlineCount();           //在线数减1
        log.info("WebSocketGpsServer 有一连接关闭！当前在线人数为" + getOnlineCount());
        List<GpsCompanyInfo> companyInfos = new ArrayList<>() ;
        gpsSockets.stream()
                .forEach(u ->{
                    if(u.getWebSocketGpsServer() == this){
                        GpsCompanyInfo info = new GpsCompanyInfo() ;
                        info.setBusinessType(u.getBusinessType());
                        info.setCompanyId(u.getCompanyId());
                        companyInfos.add(info) ;

                        gpsSockets.remove(u) ;
                        log.info("WebSocketGpsServer gpsSockets remove socket,companyId:"+u.getCompanyId());
                    }
                } );

        log.info("WebSocketGpsServer 删除关闭连接的对应关系");

        //redis维护请求GPS数据的用户,移除断掉连接的公司
        dealCloseCompany(companyInfos) ;
    }

    /*
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("WebSocketGpsServer 来自客户端的消息:" + message);

//        //群发消息
//        for (WebSocketGpsServer item : webSocketSet) {
//            try {
//                item.sendMessage(message);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
    }

    /*
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("WebSocketGpsServer 发生错误:"+error);
        error.printStackTrace();
    }

    /*
     给客户端发送文本信息
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    /*
     给客户端发送对象信息
     */
    public void sendMessage(List<GpsPushInfo> list) throws IOException {
        try {
            this.session.getBasicRemote().sendObject(list);
            log.info("WebSocketGpsServer sendMessage lists:"+list);
        } catch (EncodeException e) {
            log.error("WebSocketGpsServer sendMessage EncodeException:"+e);
            e.printStackTrace();
        }
    }

    /*
    根据BusinessType companyId，给客户端发送信息
     */
//    public static void sendMessageToCompany(String businessType ,String companyId
//            ,List<GpsPushInfo> gpsPushMsgInfos) throws IOException {
//        if(gpsPushMsgInfos !=null && gpsPushMsgInfos.size()>0){
//            gpsSockets.stream()
//                    .forEach(u->{
//                        if(u.getBusinessType().equals(businessType) && u.getCompanyId().equals(companyId)){
//                            try {
//                                u.getWebSocketGpsServer().sendMessage(gpsPushMsgInfos);
//                                log.info("WebSocketGpsServer send msg to client success,companyId:"+companyId);
//                            } catch (IOException e) {
//                                e.printStackTrace();
//                                log.error("WebSocketGpsServer send msg to client io error,companyId:"+companyId);
//                            }
//                        }
//                    });
//        }else{
//            log.info("WebSocketGpsServer sendMessageToCompany List<GpsPushInfo> is null");
//        }
//    }

    /*
    根据BusinessType companyId，给客户端发送信息
     */
    public static void sendMessageToCompany(String businessType ,String companyId
            ,String message) throws IOException {
        if(!(message ==null || "".equals(message))){
            gpsSockets.stream()
                    .forEach(u->{
                        if(u.getBusinessType().equals(businessType) && u.getCompanyId().equals(companyId)){
                            try {
                                u.getWebSocketGpsServer().sendMessage(message);
                                log.info("WebSocketGpsServer send msg to client success,companyId:"+companyId);
                            } catch (IOException e) {
                                e.printStackTrace();
                                log.error("WebSocketGpsServer send msg to client io error,companyId:"+companyId);
                            }
                        }
                    });
        }else{
            log.info("WebSocketGpsServer sendMessageToCompany message is null");
        }
    }

    /*
    定时检查存活的Session，如果未存活进行处理
     */
    @Scheduled(cron = "0 0 0/2 * * ?")
    private void checkAliveSession(){
        /*
        考虑同一个用户，多个设备登录的情况，除非多个用户都已断开，
        才通知GPS去除该用户数据
         */
        log.info("WebSocketGpsServer checkAliveSession start:"+new Date());
        List<GpsCompanyInfo> companyInfos = new ArrayList<>() ;
        gpsSockets.stream()
                .forEach(u ->{
                    if(!u.getWebSocketGpsServer().session.isOpen()){
                        GpsCompanyInfo info = new GpsCompanyInfo() ;
                        info.setBusinessType(u.getBusinessType());
                        info.setCompanyId(u.getCompanyId());
                        companyInfos.add(info) ;

                        gpsSockets.remove(u) ;
                        log.info("WebSocketGpsServer checkAliveSession remove not open socket,companyId:"+u.getCompanyId());
                    }
                } );

        //redis维护请求GPS数据的用户,移除断掉连接的公司
        dealCloseCompany(companyInfos) ;

        log.info("WebSocketGpsServer checkAliveSession end:"+new Date());
    }

    /*
    处理断掉连接的公司信息，通知GPS服务
     */
    private void dealCloseCompany(List<GpsCompanyInfo> companyInfos){
        if(companyInfos.size()>0){
            List<SocketCompanyDTO> socketCompanys = new ArrayList<>() ;
            companyInfos.stream()
                    .forEach(company ->{
                        String key = RedisKey.WEBSOCKET_GPS_USER
                                + "@"+company.getBusinessType()
                                +"@"+company.getCompanyId() ;
                        RedisTemplate<String, Object> redisTemplate = SpringUtil.getBean("redisTemplate",RedisTemplate.class);
                        int count = (Integer) redisTemplate.opsForValue().get(key) ;
                        if(count>1){
                            log.info("WebSocketGpsServer notifyGpsService company have other connect,count:"+ (count-1));
                            redisTemplate.opsForValue().set(key,count-1);
                        }else{
                            redisTemplate.delete(key);
                            SocketCompanyDTO dto = new SocketCompanyDTO() ;
                            dto.setCompanyId(company.getCompanyId());
                            dto.setCompanyType(company.getBusinessType());
                            socketCompanys.add(dto);
                            log.info("WebSocketGpsServer notifyGpsService redis remove this key:"+key);
                        }
                    });

            if(socketCompanys.size()>0){
                //notify gps websocket remove company
                GpsServiceFeign gpsServiceFeign = SpringUtil.getBean(GpsServiceFeign.class) ;
                ObjectRestResponse gpsResult = gpsServiceFeign.removeCompany(socketCompanys) ;
                if(gpsResult.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                    log.info("WebSocketGpsServer notifyGpsService feign gps websocket not success ,try again");
                    ObjectRestResponse gpsResult2 = gpsServiceFeign.removeCompany(socketCompanys) ;
                    if(gpsResult2.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                        log.error("WebSocketGpsServer notifyGpsService feign gps websocket error:"+gpsResult.getMsg());
                    }else {
                        log.info("WebSocketGpsServer notifyGpsService feign removeCompany success");
                    }
                }else {
                    log.info("WebSocketGpsServer notifyGpsService feign removeCompany success");
                }
            }

        }
    }

    /*
     群发自定义消息
     */
//    public static void sendMessageToAll(String message) throws IOException {
//        log.info(message);
//        for (GpsSocket item : gpsSockets) {
//            try {
//                item.getWebSocketGpsServer().sendMessage(message);
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
//                        u.getWebSocketGpsServer().sendMessage(gson.toJson(msgList));
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
        WebSocketGpsServer.onlineCount.getAndIncrement();
    }

    public static synchronized void subOnlineCount() {
        WebSocketGpsServer.onlineCount.getAndDecrement();
    }
}
