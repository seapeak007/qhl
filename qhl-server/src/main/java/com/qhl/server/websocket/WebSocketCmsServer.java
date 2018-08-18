package com.qhl.server.websocket;

import com.sinochem.yunlian.truck.api.vo.user.SocketUserDTO;
import com.sinochem.yunlian.truck.common.constant.CodeStatus;
import com.sinochem.yunlian.truck.common.constant.RedisKey;
import com.sinochem.yunlian.truck.common.msg.ObjectRestResponse;
import com.sinochem.yunlian.truck.ucenterinf.service.UcInfTokenService;
import com.sinochem.yunlian.truck.ucenterinf.vo.token.UcTokenBackUserInfoVo;
import com.sinochem.yunlian.truck.websocket.domain.*;
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
 * Created by qjm on 2018/8/7
 */
@Slf4j
@ServerEndpoint("/websocket/cms/{globalToken}")
@Component
@EnableScheduling
public class WebSocketCmsServer {

    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static AtomicInteger onlineCount = new AtomicInteger(0);

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArrayList<CmsSocket> cmsSockets = new CopyOnWriteArrayList<>();

    //连接打开时执行
    @OnOpen
    public void onOpen(@PathParam("globalToken") String globalToken , Session session) {

        open:{
            addOnlineCount();           //在线数加1
            log.info("WebSocketCmsServer 有新连接加入！当前在线人数为" + getOnlineCount());

            if(globalToken ==null || "".equals(globalToken)){
                log.info("WebSocketCmsServer onOpen globalToken is null");
                closeSession(session);
                break open;
            }
            //globalToken,获取user信息
            UcInfTokenService ucInfTokenService = SpringUtil.getBean(UcInfTokenService.class) ;
            UcTokenBackUserInfoVo userResult = ucInfTokenService.getBackUserInfoByGlobalToken(globalToken) ;
            if(userResult == null){
                log.info("WebSocketCmsServer onOpen token feign not success,globalToken:"+globalToken);
                closeSession(session);
                break open;
            }

            //redis维护请求GPS数据的用户,增加该用户的请求渠道次数+1
            String key = RedisKey.WEBSOCKET_CMS_USER
                    + "@"+userResult.getUserId() ;
            RedisTemplate<String, Object> redisTemplate = SpringUtil.getBean("redisTemplate",RedisTemplate.class);
            if(redisTemplate.hasKey(key)){
                log.info("WebSocketCmsServer onOpen redis have exist this key:"+key);
                redisTemplate.opsForValue().increment(key,1) ;
            }else{
                //notify cms gps websocket add user
                SocketUserDTO dto = new SocketUserDTO() ;
                dto.setUserId(String.valueOf(userResult.getUserId()));

                GpsServiceFeign gpsServiceFeign = SpringUtil.getBean(GpsServiceFeign.class) ;
                ObjectRestResponse gpsResult = gpsServiceFeign.addConnUser(dto) ;
                if(gpsResult.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                    log.info("WebSocketCmsServer onOpen feign cms gps websocket not success ,try again");
                    ObjectRestResponse gpsResult2 = gpsServiceFeign.addConnUser(dto) ;
                    if(gpsResult2.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                        log.error("WebSocketCmsServer onOpen feign cms gps websocket error:"+gpsResult.getMsg());
                        closeSession(session);
                        break open;
                    }
                }
                log.info("WebSocketCmsServer onOpen redis first save this key:"+key);
                redisTemplate.opsForValue().set(key,1);
                log.info("WebSocketCmsServer onOpen feign addConnUser success,userId:"
                        +userResult.getUserId());
            }

            this.session = session;
            //添加到用户Session对应关系中
            CmsSocket cmsSocket = new CmsSocket();
            cmsSocket.setUserId(String.valueOf(userResult.getUserId()));
            cmsSocket.setRoleType(userResult.getRoleType());
            cmsSocket.setWebSocketCmsServer(this);
            cmsSockets.add(cmsSocket) ;

            /*
//           测试推送数据长度
            try {
                StringBuffer msg =new StringBuffer()  ;
//                {"centerLat":"27.403234","centerLon":"117.504426","maxLat":"31.849878","maxLon":"121.434785","minLat":"22.956590","minLon":"113.574066","locations":[{"lon":"121.434785","lat":"31.849878","vehicleNo":"京AA8866","transportStatus":"0"},{"lon":"113.574066","lat":"22.956590","vehicleNo":"京ETYUUII","transportStatus":"0"}]}

                for(int i=0;i<100000;i++){
                    msg.append( "                {\"centerLat\":\"27.403234\",\"centerLon\":\"117.504426\",\"maxLat\":\"31.849878\"" +
                            ",\"maxLon\":\"121.434785\",\"minLat\":\"22.956590\",\"minLon\":\"113.574066\"" +
                            ",\"locations\":[{\"lon\":\"121.434785\",\"lat\":\"31.849878\",\"vehicleNo\":\"京AA8866\",\"transportStatus\":\"0\"}" +
                            ",{\"lon\":\"113.574066\",\"lat\":\"22.956590\",\"vehicleNo\":\"京ETYUUII\",\"transportStatus\":\"0\"}]}\n"
                    );
                }
                sendMessage("server连接成功;"+msg.toString());
            } catch (IOException e) {
                log.error("websocket IO异常");
            }*/
            log.info("WebSocketCmsServer Connected ... " + session.getId());
        }

    }

    /*
    服务端不接收非合规的client，进行关闭操作
     */
    private void closeSession(Session session){
        try {
            session.close();
        } catch (IOException e) {
            log.error("WebSocketCmsServer close error:"+e);
            e.printStackTrace();
        }
    }

    /*
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        subOnlineCount();           //在线数减1
        log.info("WebSocketCmsServer 有一连接关闭！当前在线人数为" + getOnlineCount());
        List<CmsGpsInfo> cmsGpsInfos = new ArrayList<>() ;
        cmsSockets.stream()
                .forEach(u ->{
                    if(u.getWebSocketCmsServer() == this){
                        CmsGpsInfo info = new CmsGpsInfo() ;
                        info.setUserId(u.getUserId());
                        info.setRoleType(u.getRoleType());
                        cmsGpsInfos.add(info) ;

                        cmsSockets.remove(u) ;
                        log.info("WebSocketCmsServer Sockets remove socket,userId:"+u.getUserId());
                    }
                } );

        log.info("WebSocketCmsServer 删除关闭连接的对应关系");

        //redis维护请求GPS数据的用户,移除断掉连接的公司
        dealCloseUser(cmsGpsInfos) ;
    }

    /*
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("WebSocketCmsServer 来自客户端的消息:" + message);

//        //群发消息
//        for (WebSocketCmsServer item : webSocketSet) {
//            try {
//                item.sendMessage(message);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
    }

    /*
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("WebSocketCmsServer 发生错误:"+error);
        error.printStackTrace();
    }

    /*
     给客户端发送文本信息
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    /*
    根据userId，给客户端发送信息
     */
    public static void sendMessageToUser(String userId ,String message) throws IOException {
        if(!(message ==null || "".equals(message))){
            cmsSockets.stream()
                    .forEach(u->{
                        if(u.getUserId().equals(userId)){
                            try {
                                u.getWebSocketCmsServer().sendMessage(message);
                                log.info("WebSocketCmsServer send msg to client success,userId:"+userId);
                            } catch (IOException e) {
                                log.error("WebSocketCmsServer send msg error:"+e);
                                log.error("WebSocketCmsServer send msg to client io error,userId:"+userId);
                            }
                        }
                    });
        }else{
            log.info("WebSocketCmsServer sendMessageToCompany message is null");
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
        log.info("WebSocketCmsServer checkAliveSession start:"+new Date());
        List<CmsGpsInfo> cmsGpsInfos = new ArrayList<>() ;
        cmsSockets.stream()
                .forEach(u ->{
                    if(!u.getWebSocketCmsServer().session.isOpen()){
                        CmsGpsInfo info = new CmsGpsInfo() ;
                        info.setUserId(u.getUserId());
                        info.setRoleType(u.getRoleType());
                        cmsGpsInfos.add(info) ;

                        cmsSockets.remove(u) ;
                        log.info("WebSocketCmsServer checkAliveSession remove not open socket,userId:"+u.getUserId());
                    }
                } );

        //redis维护请求GPS数据的用户,移除断掉连接的公司
        dealCloseUser(cmsGpsInfos) ;

        log.info("WebSocketCmsServer checkAliveSession end:"+new Date());
    }

    /*
    处理断掉连接的公司信息，通知GPS服务
     */
    private void dealCloseUser(List<CmsGpsInfo> cmsGpsInfos){
        if(cmsGpsInfos.size()>0){
            List<SocketUserDTO> socketUserDTOS = new ArrayList<>() ;
            cmsGpsInfos.stream()
                    .forEach(cmsGpsInfo ->{
                        String key = RedisKey.WEBSOCKET_CMS_USER
                                + "@"+cmsGpsInfo.getUserId() ;
                        RedisTemplate<String, Object> redisTemplate = SpringUtil.getBean("redisTemplate",RedisTemplate.class);
                        int count = (Integer) redisTemplate.opsForValue().get(key) ;
                        if(count>1){
                            log.info("WebSocketCmsServer notify CmsService userId have other connect,count:"+ (count-1));
                            redisTemplate.opsForValue().set(key,count-1);
                        }else{
                            redisTemplate.delete(key);
                            SocketUserDTO dto = new SocketUserDTO() ;
                            dto.setUserId(cmsGpsInfo.getUserId());
                            socketUserDTOS.add(dto);
                            log.info("WebSocketCmsServer notify CmsService redis remove this key:"+key);
                        }
                    });

            if(socketUserDTOS.size()>0){
                //notify cms websocket remove company
                GpsServiceFeign gpsServiceFeign = SpringUtil.getBean(GpsServiceFeign.class) ;
                ObjectRestResponse gpsResult = gpsServiceFeign.removeConnUser(socketUserDTOS) ;
                if(gpsResult.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                    log.info("WebSocketCmsServer notify CmsService feign websocket not success ,try again");
                    ObjectRestResponse gpsResult2 = gpsServiceFeign.removeConnUser(socketUserDTOS) ;
                    if(gpsResult2.getStatus() != CodeStatus.CODE_SUCCESS.getValue()){
                        log.error("WebSocketCmsServer notify CmsService feign websocket error:"+gpsResult.getMsg());
                    }else {
                        log.info("WebSocketCmsServer notify CmsService feign removeConnUser success");
                    }
                }else {
                    log.info("WebSocketCmsServer notify CmsService feign removeConnUser success");
                }
            }

        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount.get();
    }

    public static synchronized void addOnlineCount() {
        WebSocketCmsServer.onlineCount.getAndIncrement();
    }

    public static synchronized void subOnlineCount() {
        WebSocketCmsServer.onlineCount.getAndDecrement();
    }
}
