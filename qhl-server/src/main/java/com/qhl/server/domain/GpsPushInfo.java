package com.qhl.server.domain;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * Created by qjm on 2018/7/13
 */
public class GpsPushInfo implements Serializable{
    /*
     纬度
     */
    @Getter@Setter
    private String lat ;
    /*
     经度
     */
    @Getter@Setter
    private String lon ;
    /*
     车牌号
     */
    @Getter@Setter
    private String vehicleNo ;
    /*
     是否空闲
     */
    @Getter@Setter
    private int free = 0;

}
