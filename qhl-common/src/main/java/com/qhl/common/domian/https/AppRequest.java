package com.qhl.common.domian.https;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
public class AppRequest<T> {

    public static boolean DEBUG = false;
    public static boolean UTF8_FILTER = false;

    /**
     * 密钥版本
     */
    @ApiModelProperty(value = "交换的密匙，盐值版本号")
    @Getter
    @Setter
    @JsonProperty("ver")
    private int version;
    /**
     * 请求时间戳
     */
    @ApiModelProperty(value = "请求时间戳")
    @Getter
    @Setter
    @JsonProperty("tsrq")
    private long requestTimestamp;
    /**
     * 数据体
     */
    @ApiModelProperty(value = "请求对象体")
    @Getter
    @Setter
    @JsonProperty("rqbd")
    private T requestBody;

    /**
     * 加密数据体
     */
    @ApiModelProperty(value = "请求对象加密数据")
    @Getter
    @Setter
    @JsonProperty("rqed")
    private String requestEncryptData;
    /**
     * 数据摘要信息
     */
    @ApiModelProperty(value = "请求对象签名")
    @Getter
    @Setter
    @JsonProperty("rqds")
    private String requestDigest;

}
