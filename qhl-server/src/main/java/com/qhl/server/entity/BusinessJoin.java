package com.qhl.server.entity;

import com.qhl.common.contant.BusinessJoinType;
import com.qhl.common.contant.Sex;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Date;

/**
 * Created by qjm on 18-8-18
 */
@Data
@Entity
@Table(name = "business_join")
public class BusinessJoin {
    @Id
    @Column(name = "join_id")
    private Long JoinId ;

    /*
    会议类型，哪次会议
     */
    @Column(name = "join_type")
    private BusinessJoinType businessJoinType ;
    /*
    姓名
     */
    @Column(name = "name")
    private String name ;
    /*
    性别，0未录入
     */
    @Column(name = "sex")
    private Sex sex ;
    /*
    职务
     */
    @Column(name = "grade")
    private String grade ;
    /*
    手机号
     */
    @Column(name = "phone")
    private Long phone ;
    /*
    邮箱
     */
    @Column(name = "email")
    private String email ;
    /*
    单位名称
     */
    @Column(name = "company_name")
    private String companyName;
    /*
    单位地址
     */
    @Column(name = "company_address")
    private String companyAddress ;
    /*
    单位传真
     */
    @Column(name = "company_fax")
    private String companyFax ;
    /*
    单位邮编
     */
    @Column(name = "company_zip")
    private String companyZip ;
    /*
    备注
     */
    @Column(name = "remark")
    private String remark ;
    /*
    创建时间
     */
    @Column(name = "create_time")
    private Date createTime ;


}
