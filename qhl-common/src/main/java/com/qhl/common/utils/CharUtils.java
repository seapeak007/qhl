package com.qhl.common.utils;

/**
 * Created by qjm on 2018/7/4
 */
public class CharUtils {
    public CharUtils() {
    }

    public static int convertLetterToNum(char ch) {
        int index;
        if (ch > 'n') {
            index = ch - 89;
        } else if (ch > 'h') {
            index = ch - 88;
        } else if (ch > '`') {
            index = ch - 87;
        } else if (ch > 'V') {
            index = ch - 58;
        } else if (ch > 'O') {
            index = ch - 57;
        } else if (ch > 'I') {
            index = ch - 56;
        } else if (ch > '9') {
            index = ch - 55;
        } else {
            index = ch - 48;
        }

        return index;
    }
}
