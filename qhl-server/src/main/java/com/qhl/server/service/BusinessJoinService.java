package com.qhl.server.service;

import com.qhl.server.domian.BusinessJoinInfo;
import com.qhl.server.exception.TransException;

/**
 * Created by qjm on 18-8-18
 */
public interface BusinessJoinService {
    void add(BusinessJoinInfo info) throws TransException ;
}
