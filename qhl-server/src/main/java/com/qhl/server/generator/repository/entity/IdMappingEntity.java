package com.qhl.server.generator.repository.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Version;
import java.sql.Timestamp;

/**
 * ID生成器的持久化记录
 * 
 * @author Jackson Lee
 *
 */
@Entity(name = "id_mapping")
public class IdMappingEntity {
	@Id
	@Getter
	@Setter
	@Column(name = "name")
	private String name;

	@Getter
	@Setter
	@Column(name = "top_id")
	private long topId = 0;

	@Version
	@Column(name = "version")
	@Getter @Setter
	private Timestamp version;
}
