package com.qhl.server.generator.repository;


import com.qhl.server.generator.repository.entity.IdMappingEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdMappingRepository extends CrudRepository<IdMappingEntity, String> {

}
