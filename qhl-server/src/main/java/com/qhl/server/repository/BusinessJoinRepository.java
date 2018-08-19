package com.qhl.server.repository;

import com.qhl.common.contant.BusinessJoinType;
import com.qhl.server.entity.BusinessJoin;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by qjm on 18-8-18
 */
public interface BusinessJoinRepository extends CrudRepository<BusinessJoin,Long>{
    BusinessJoin findByPhoneAndBusinessJoinType(Long phone,BusinessJoinType businessJoinType) ;
}
