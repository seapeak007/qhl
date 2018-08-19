package com.qhl.server.service.impl;

import com.qhl.common.contant.ErrorCodeUtils;
import com.qhl.server.domian.BusinessJoinInfo;
import com.qhl.server.entity.BusinessJoin;
import com.qhl.server.exception.TransException;
import com.qhl.server.generator.IdGenerator;
import com.qhl.server.generator.service.IdGeneratorService;
import com.qhl.server.repository.BusinessJoinRepository;
import com.qhl.server.service.BusinessJoinService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * Created by qjm on 18-8-18
 */
@Service
@Slf4j
public class BusinessJoinServiceImpl implements BusinessJoinService {

    private final BusinessJoinRepository businessJoinRepository ;
    private final IdGenerator idGenerator ;

    public BusinessJoinServiceImpl(BusinessJoinRepository businessJoinRepository
            ,IdGeneratorService idGeneratorService){
        this.businessJoinRepository = businessJoinRepository ;
        this.idGenerator = new IdGenerator("business_join",idGeneratorService,10000) ;
    }

    @Override
    @Transactional
    public void add(BusinessJoinInfo info) throws TransException {
        if(info ==null ||info.getPhone()<1){
            throw new TransException(ErrorCodeUtils.COMMON_PARAM,"参数有误") ;
        }
        BusinessJoin businessJoin = new BusinessJoin() ;
        BeanUtils.copyProperties(info,businessJoin);
        businessJoin.setJoinId(idGenerator.newId());
        businessJoin.setCreateTime(new Date());
        this.businessJoinRepository.save(businessJoin) ;
    }
}
