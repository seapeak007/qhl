package com.qhl.server.domain;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by qjm on 2018/7/16
 */
public class GpsCompanyInfo {

    /*
     货主或者物流公司的渠道类型
     */
    @Getter@Setter
    private String businessType ;

    /*
      公司ID
     */
    @Getter@Setter
    private String companyId ;
}
