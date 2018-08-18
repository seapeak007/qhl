package com.qhl.server.controller;

import com.qhl.common.contant.BusinessJoinType;
import com.qhl.server.domian.BusinessJoinInfo;
import com.qhl.server.exception.TransException;
import com.qhl.server.service.BusinessJoinService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by qjm on 2018/8/6
 */
@RestController
public class BusinessJoinController {

    private final BusinessJoinService businessJoinService ;
    public BusinessJoinController(BusinessJoinService businessJoinService){
        this.businessJoinService = businessJoinService ;
    }
    /*
     会议报名
     type 哪一次报名
     */
    @PostMapping("/business/type/join")
    public int onlineCount(@RequestBody BusinessJoinInfo info,int type){

        try{
            info.setBusinessJoinType(BusinessJoinType.parser(type)) ;
            this.businessJoinService.add(info);
        }catch (TransException te){
//            TODO:设置返回类型进行赋值，type取值使用标签path
        }catch (IllegalArgumentException ie){
            //非法请求type
        }catch (Exception e){

        }
        return 1 ;
    }

}
