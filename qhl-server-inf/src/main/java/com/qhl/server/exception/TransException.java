package com.qhl.server.exception;

/**
 * Created by qjm on 2018/8/4
 */

public class TransException extends RuntimeException {
    private int errorCode;

    public TransException(int errorCode) {
        this.errorCode = errorCode;
    }

    public TransException(int errorCode, String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
        this.errorCode = errorCode;
    }

    public TransException(int errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public TransException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public TransException(int errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return this.errorCode;
    }
}
