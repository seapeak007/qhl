package com.qhl.server.config;

import com.alibaba.rocketmq.client.consumer.DefaultMQPushConsumer;
import com.alibaba.rocketmq.client.exception.MQClientException;
import com.alibaba.rocketmq.common.protocol.heartbeat.MessageModel;
import com.sinochem.yunlian.truck.websocket.exception.RocketMQException;
import com.sinochem.yunlian.truck.websocket.rocketMQ.MessageListener;
import com.sinochem.yunlian.truck.websocket.rocketMQ.MessageProcessor;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * User: ning.li
 * Date: 2018-01-15
 */
@Configuration
public class RocketMQConsumerConfiguration {
    public static final Logger LOGGER = LoggerFactory.getLogger(RocketMQConsumerConfiguration.class);
    @Value("${spring.rocketmq.consumer.namesrvAddr}")
    private String namesrvAddr;
    @Value("${spring.rocketmq.consumer.groupName}")
    private String groupName;
    @Value("${spring.rocketmq.consumer.topicMessage}")
    private String topic;
    @Value("${spring.rocketmq.consumer.tag}")
    private String tag;
    @Value("${spring.rocketmq.consumer.consumeThreadMin}")
    private int consumeThreadMin;
    @Value("${spring.rocketmq.consumer.consumeThreadMax}")
    private int consumeThreadMax;

    @Autowired
    @Qualifier("messageProcessor")
    private MessageProcessor messageProcessor;

    @Bean
    public DefaultMQPushConsumer getRocketMQConsumer() throws RocketMQException {
        if (StringUtils.isBlank(groupName)){
            throw new RocketMQException("groupName is null !!!");
        }
        if (StringUtils.isBlank(namesrvAddr)){
            throw new RocketMQException("namesrvAddr is null !!!");
        }
        if (StringUtils.isBlank(topic)){
            throw new RocketMQException("topic is null !!!");
        }
        if (StringUtils.isBlank(tag)){
            throw new RocketMQException("tag is null !!!");
        }
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer(groupName);
        consumer.setNamesrvAddr(namesrvAddr);
        consumer.setConsumeThreadMin(consumeThreadMin);
        consumer.setConsumeThreadMax(consumeThreadMax);
        MessageListener messageListener = new MessageListener();
        messageListener.setMessageProcessor(messageProcessor);
        consumer.registerMessageListener(messageListener);
        /*
        设置广播模式
         */
        consumer.setMessageModel(MessageModel.BROADCASTING);
        try {
            consumer.subscribe(topic,"*");
            consumer.start();
            LOGGER.info("consumer is start !!! groupName:{},topic:{},namesrvAddr:{}",groupName,topic,namesrvAddr);
        }catch (MQClientException e){
            LOGGER.error("consumer is start !!! groupName:{},topic:{},namesrvAddr:{}",groupName,topic,namesrvAddr,e);
            throw new RocketMQException(e);
        }
        return consumer;
    }

}