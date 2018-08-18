package com.qhl.server.controller;

import com.sinochem.yunlian.truck.websocket.websocket.WebSocketGpsServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by qjm on 2018/7/6
 */
@RestController
@Slf4j
public class WebSocketGpsController {

    /*
     查询现在的session连接数
     */
    @PostMapping("/websocket/gps/onlineCount")
    public int onlineCount(){
        return WebSocketGpsServer.getOnlineCount() ;
    }

}
