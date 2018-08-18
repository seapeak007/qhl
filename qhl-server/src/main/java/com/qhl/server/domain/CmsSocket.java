package com.qhl.server.domain;

import com.sinochem.yunlian.truck.websocket.websocket.WebSocketCmsServer;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by qjm on 2018/8/7
 */
public class CmsSocket {

    /*
    用户ID
     */
    @Getter@Setter
    private String userId ;

    /*
     * 角色类型
     */
    @Getter@Setter
    private String roleType;

    @Getter@Setter
    private WebSocketCmsServer webSocketCmsServer ;

}
