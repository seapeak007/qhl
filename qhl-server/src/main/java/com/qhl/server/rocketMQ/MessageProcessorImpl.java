package com.qhl.server.rocketMQ;

import com.alibaba.rocketmq.common.message.MessageExt;
import com.fasterxml.jackson.databind.JsonNode;
import com.sinochem.yunlian.truck.common.constant.MessageEnum;
import com.sinochem.yunlian.truck.common.util.JacksonUtils;
import com.sinochem.yunlian.truck.websocket.websocket.WebSocketCmsServer;
import com.sinochem.yunlian.truck.websocket.websocket.WebSocketGpsServer;
import com.sinochem.yunlian.truck.websocket.websocket.WebSocketUserServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Created by qjm on 2018/7/12
 */
@Slf4j
@Service("messageProcessor")
public class MessageProcessorImpl implements MessageProcessor {

    @Override
    public boolean handleMessage(MessageExt messageExt) {

        String tag = messageExt.getTags();
        String keys = messageExt.getKeys();

        try {
            String body = new String(messageExt.getBody(), "UTF-8");
            JsonNode resultJson = JacksonUtils.readRootNode(body);
            log.info("<<<<新消息推送>>>>tags=" + tag + "||keys=" + keys + "||body=" + body);
            //用户状态推送
            if (MessageEnum.STATUS_USER_STATUS.getStatus().equals(tag)) {
                JsonNode userJson = resultJson.get("data") ;
                String userId = userJson.get("userId").asText();
                String os = userJson.get("os").asText();
                String businessType = userJson.get("businessType").asText();
                String statusJson = userJson.get("status").asText();
                log.info("mq receive user message,user:"+userJson);
                //用户状态发送
                WebSocketUserServer.PushMsgInfoToUser(userId,os,businessType,statusJson);

            }else if (MessageEnum.STATUS_GPS_PUSH.getStatus().equals(tag)) {
                //发送gps数据
                String[] arr = keys.split(",") ;
                log.info("mq receive gps message,keys:"+keys);
                //Gps 推送数据
                WebSocketGpsServer.sendMessageToCompany(arr[0],arr[1],body);
            }else if(MessageEnum.STATUS_CMS_PUSH.getStatus().equals(tag)){
                //cms gps数据推送
                log.info("mq receive cms gps message,keys:"+keys);
                WebSocketCmsServer.sendMessageToUser(keys,body);
            }
            return true;
        } catch (Exception e) {
            log.error("mq receive deal exception:"+e);
            e.printStackTrace();
            return true;
        }
    }
}
