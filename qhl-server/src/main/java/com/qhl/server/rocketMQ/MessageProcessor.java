package com.qhl.server.rocketMQ;

import com.alibaba.rocketmq.common.message.MessageExt;

public interface MessageProcessor {
    /**
     * 处理消息的接口
     * @param messageExt
     * @return
     */
    public boolean handleMessage(MessageExt messageExt);
}
