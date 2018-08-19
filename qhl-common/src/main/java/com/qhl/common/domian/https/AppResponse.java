package com.qhl.common.domian.https;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.nio.charset.Charset;

/**
 * The type App response.
 *
 * @param <T> the type parameter
 */
@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(Include.NON_NULL)
public class AppResponse<T> extends CommonResponse {

    /**
     * The constant DEBUG.
     */
    public static boolean DEBUG = false;

    private final static Charset UTF_8 = Charset.forName("UTF-8");


    /**
     * 版本号
     */
    @ApiModelProperty(value = "交换的密匙，盐值版本号")
    private int ver;
    /**
     * 时间戳
     */
    @ApiModelProperty(value = "返回数据的时间戳")
    private long tsrp;
    /**
     *
     */
    @ApiModelProperty(value = "返回数据对象体")
    private T rpbd;
    /**
     *
     */
    @ApiModelProperty(value = "返回数据加密体")
    private String rped;

    /**
     * 签名结果
     */
    @ApiModelProperty(value = "返回数据签名")
    private String rpds;

    /**
     * app login sid
     */
    @ApiModelProperty(value = "app登录的用户key")
    private String lgtk;


    public AppResponse() {
        super();
    }

    /**
     * Instantiates a new App response.
     *
     * @param rpco the rpco
     * @param msg  the msg
     */
    public AppResponse(int rpco, String msg) {
        super(rpco, msg);
    }

    /**
     * Instantiates a new App response.
     *
     * @param object the object
     */
    public AppResponse(T object) {
        super(200, null);
        this.rpbd = object;
    }

}
