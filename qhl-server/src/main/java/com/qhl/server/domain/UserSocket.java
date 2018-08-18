package com.qhl.server.domain;

import com.sinochem.yunlian.truck.websocket.websocket.WebSocketUserServer;
import lombok.Getter;
import lombok.Setter;


/**
 * Created by qjm on 2018/7/7
 */
public class UserSocket {

    /*
    用户ID
     */
    @Getter@Setter
    private String userId ;

    /*
    客户端平台
     */
    @Getter@Setter
    private String os ;

    /*
     货主或者物流公司的渠道类型
     */
    @Getter@Setter
    private String businessType ;

    @Getter@Setter
    private WebSocketUserServer webSocketUserServer;

}
