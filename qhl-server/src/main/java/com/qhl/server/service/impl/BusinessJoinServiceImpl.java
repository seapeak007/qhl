package com.qhl.server.service.impl;

import com.qhl.server.domian.BusinessJoinInfo;
import com.qhl.server.exception.TransException;
import com.qhl.server.repository.BusinessJoinRepository;
import com.qhl.server.service.BusinessJoinService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Created by qjm on 18-8-18
 */
@Service
@Slf4j
public class BusinessJoinServiceImpl implements BusinessJoinService {

    private final BusinessJoinRepository businessJoinRepository ;

    public BusinessJoinServiceImpl(BusinessJoinRepository businessJoinRepository){
        this.businessJoinRepository = businessJoinRepository ;
    }
    @Override
    public void add(BusinessJoinInfo info) throws TransException {

    }
}
