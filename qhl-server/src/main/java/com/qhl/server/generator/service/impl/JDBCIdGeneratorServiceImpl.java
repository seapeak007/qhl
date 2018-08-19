package com.qhl.server.generator.service.impl;

import com.qhl.server.generator.repository.IdMappingRepository;
import com.qhl.server.generator.repository.entity.IdMappingEntity;
import com.qhl.server.generator.service.IdGeneratorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Slf4j
public class JDBCIdGeneratorServiceImpl implements IdGeneratorService {

	private IdMappingRepository repository;

	public JDBCIdGeneratorServiceImpl(IdMappingRepository repository){
		this.repository = repository;
	}

	@Transactional
	public Long getDBId(String name, int step) {
		IdMappingEntity idMapping = repository.findOne(name);
		if (idMapping == null) {
			idMapping = new IdMappingEntity();
			idMapping.setName(name);
		}
		idMapping.setTopId(idMapping.getTopId() + step);
		return repository.save(idMapping).getTopId();
	}

	@Override
	public long getNewBlock(String name, int step) {
		long ret;
		Long dbId = null;
		while (true) {

			try {
				dbId = getDBId(name, step) - step;
			} catch (Exception e) {
				log.warn("获取数据库ID错误(name={},step={},err={}", name, step, e.getLocalizedMessage());
			}

			if (dbId != null) {
				ret = dbId;
				break;
			}
		}
		return ret;
	}

}
