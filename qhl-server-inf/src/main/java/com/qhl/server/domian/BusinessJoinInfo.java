package com.qhl.server.domian;

import com.qhl.common.contant.BusinessJoinType;
import com.qhl.common.contant.Sex;
import lombok.Data;

import java.sql.Date;

/**
 * Created by qjm on 18-8-18
 */
@Data
public class BusinessJoinInfo {

    private Long JoinId ;

    /*
    会议类型，哪次会议
     */
    private BusinessJoinType businessJoinType ;
    /*
    姓名
     */
    private String name ;
    /*
    性别，0未录入
     */
    private Sex sex ;
    /*
    职务
     */
    private String grade ;
    /*
    手机号
     */
    private Long phone ;
    /*
    邮箱
     */
    private String email ;
    /*
    单位名称
     */
    private String companyName;
    /*
    单位地址
     */
    private String companyAddress ;
    /*
    单位传真
     */
    private String companyFax ;
    /*
    单位邮编
     */
    private String companyZip ;
    /*
    创建时间
     */
    private Date createTime ;


}
