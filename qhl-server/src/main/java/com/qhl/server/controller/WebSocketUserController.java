package com.qhl.server.controller;

import com.sinochem.yunlian.truck.websocket.websocket.WebSocketUserServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by qjm on 2018/7/6
 */
@RestController
@EnableScheduling
@Slf4j
public class WebSocketUserController {

    /*
     查询现在的session连接数
     */
    @PostMapping("/websocket/user/onlineCount")
    public int onlineCount(){
        return WebSocketUserServer.getOnlineCount() ;
    }
}
