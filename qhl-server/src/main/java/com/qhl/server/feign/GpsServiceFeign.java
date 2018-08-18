package com.qhl.server.feign;

import com.sinochem.yunlian.truck.api.vo.fleet.SocketCompanyDTO;
import com.sinochem.yunlian.truck.api.vo.user.SocketUserDTO;
import com.sinochem.yunlian.truck.common.msg.ObjectRestResponse;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * Created by qjm on 2018/7/14
 */
@FeignClient(value = "${homepage.serviceId}")
public interface GpsServiceFeign {
    /*
    增加获取GPS数据的公司
     */
    @RequestMapping(value = "/homepage/socket/addCompany" ,method = RequestMethod.POST)
    ObjectRestResponse addCompany(@RequestBody List<SocketCompanyDTO> socketCompanys);

    /*
    移除获取GPS数据的公司
     */
    @RequestMapping(value = "/homepage/socket/removeCompany" ,method = RequestMethod.POST)
    ObjectRestResponse removeCompany(@RequestBody List<SocketCompanyDTO> socketCompanys);

    /*
    增加获取CMS GPS数据的用户数据
     */
    @RequestMapping(value = "/homepage/socket/addConnUser" ,method = RequestMethod.POST)
    ObjectRestResponse addConnUser(@RequestBody SocketUserDTO socketUserDTO);

    /*
    移除获取CMS GPS数据的用户数据
     */
    @RequestMapping(value = "/homepage/socket/removeConnUser" ,method = RequestMethod.POST)
    ObjectRestResponse removeConnUser(@RequestBody List<SocketUserDTO> socketUserDTOS);
}
