package com.qhl.common.domian.https;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author danielmiao
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonResponse implements Serializable{


	/**
	 * 返回码
	 */
    @ApiModelProperty(value = "错误码，正常为200", example = "200")
    private int rpco;

	/**
	 * 错误信息
	 */
    @ApiModelProperty(value = "错误信息")
    private String msg;
}
