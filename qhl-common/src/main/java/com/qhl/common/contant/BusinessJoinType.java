package com.qhl.common.contant;

import java.util.HashMap;

/**
 * Created by qjm on 18-8-18
 * 商务会议类型
 */
public enum BusinessJoinType {

    /*
    2018年9月15日
     */
    FRIST(1),

    SECOND(2),

    THRID(3) ;


    private int value;

    static HashMap<Integer, BusinessJoinType> map = new HashMap<>();

    static {
        for (BusinessJoinType value : BusinessJoinType.values()) {
            map.put(value.getValue(), value);
        }
    }

    BusinessJoinType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static BusinessJoinType parser(int value) {
        BusinessJoinType vf = map.get(value);
        if (vf == null) {
            throw new IllegalArgumentException(String.format("BusinessJoinType  parser error, value=[%d].", value));
        }
        return vf;
    }
}

