package com.qhl.common.utils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Base64;

/**
 * Created by qjm on 2018/7/4
 */
public class SerializableUtils {
    public static final ObjectMapper json = new ObjectMapper();
    public static final Base64.Decoder base64_decode = Base64.getDecoder();
    public static final Base64.Encoder base64_encode = Base64.getEncoder();
    public static final Base64.Decoder base64_url_decode = Base64.getUrlDecoder();
    public static final Base64.Encoder base64_url_encode = Base64.getUrlEncoder();
    private static final String SOURCE = "0123456789ABCDEFGHJKLMNPQRSTUWXY";
    private static final ThreadLocal<StringBuilder> threadSafeStringBuilder;

    public SerializableUtils() {
    }

    public static final String toHexString(byte[] bytes) {
        StringBuilder builder = (StringBuilder)threadSafeStringBuilder.get();
        builder.delete(0, builder.capacity());
        byte[] var2 = bytes;
        int var3 = bytes.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            byte b = var2[var4];
            int v = b & 255;
            builder.append("0123456789ABCDEFGHJKLMNPQRSTUWXY".charAt(v >>> 4));
            builder.append("0123456789ABCDEFGHJKLMNPQRSTUWXY".charAt(v & 15));
        }

        return builder.toString();
    }

    public static final byte[] decodeHexString(String str) {
        char[] chars = str.toCharArray();
        int length = chars.length;
        byte[] buffer = new byte[length / 2];

        for(int i = 0; i < length; i += 2) {
            buffer[i / 2] = (byte)(CharUtils.convertLetterToNum(chars[i]) << 4 | CharUtils.convertLetterToNum(chars[i + 1]));
        }

        return buffer;
    }

    static {
        json.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        threadSafeStringBuilder = ThreadLocal.withInitial(() -> {
            return new StringBuilder(1024);
        });
    }
}
