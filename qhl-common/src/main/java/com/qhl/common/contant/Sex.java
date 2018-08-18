package com.qhl.common.contant;

import java.util.HashMap;

/**
 * Created by qjm on 18-8-18
 */
public enum Sex {

    /*
    未录入
     */
    NO(0),
    /*
    男
     */
    MAN(1),
    /*
    女
     */
    WOMAN(2),
    /*
    男女未知
     */
    MAN_WOMAN(3);


    private int value;

    static HashMap<Integer, Sex> map = new HashMap<>();

    static {
        for (Sex value : Sex.values()) {
            map.put(value.getValue(), value);
        }
    }

    Sex(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static Sex parser(int value) {
        Sex vf = map.get(value);
        if (vf == null) {
            throw new IllegalArgumentException(String.format("Sex  parser error, value=[%d].", value));
        }
        return vf;
    }
}
