package com.qhl.server.controller;

import com.qhl.common.contant.BusinessJoinType;
import com.qhl.common.contant.ErrorCodeUtils;
import com.qhl.common.domian.https.AppResponse;
import com.qhl.server.domian.BusinessJoinInfo;
import com.qhl.server.exception.TransException;
import com.qhl.server.service.BusinessJoinService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by qjm on 2018/8/16
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
    @PostMapping("/business/{type}/join")
    public AppResponse onlineCount(@RequestBody BusinessJoinInfo info, @PathVariable("type") int type){

        try{
            info.setBusinessJoinType(BusinessJoinType.parser(type)) ;
            this.businessJoinService.add(info);
            return new AppResponse(200,"success");
        }catch (TransException te){
            return new AppResponse(te.getErrorCode(),te.getMessage());
        }catch (IllegalArgumentException ie){
            return new AppResponse(ErrorCodeUtils.COMMON_PARAM,"not support type");
        }catch (Exception e){
            return new AppResponse(ErrorCodeUtils.GATEWAY_BAD,"server error");
        }
    }

}
