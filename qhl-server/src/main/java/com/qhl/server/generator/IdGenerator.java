package com.qhl.server.generator;

import com.qhl.server.generator.service.IdGeneratorService;

import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import java.util.concurrent.atomic.AtomicLongFieldUpdater;

/**
 * ID生成器
 *
 * @author Jackson Lee
 *
 */
public class IdGenerator {
	private static final AtomicIntegerFieldUpdater<IdGenerator> RESIDUE_UPDATER = AtomicIntegerFieldUpdater
			.newUpdater(IdGenerator.class, "residue");
	private static final AtomicLongFieldUpdater<IdGenerator> LOCAL_UPDATER = AtomicLongFieldUpdater
			.newUpdater(IdGenerator.class, "local");

	private final String name;
	private volatile int residue = 0;
	private volatile long local = -1L;
	private IdGeneratorService service;
	private int blockSize = 10000;

	public IdGenerator(String name, IdGeneratorService service, int blockSize) {
		this.name = name;
		this.service = service;
		this.blockSize = blockSize;
		init();
	}

	public String getName() {
		return name;
	}

	/**
	 * 初始化
	 * 
	 * @return 初始化状态
	 */
	private boolean init() {
		boolean ret = false;
		long id = service.getNewBlock(name, blockSize);
		if (id >= 0) {

			synchronized (this) {
				LOCAL_UPDATER.set(this, id);
				RESIDUE_UPDATER.set(this, 0);
				ret = false;
			}
		}
		return ret;
	}

	/**
	 * 获取新ID
	 * 
	 * @return 返回新的ID
	 */
	public long newId() {
		int value = RESIDUE_UPDATER.getAndIncrement(this);
		if (value >= blockSize) {
			synchronized (this) {
				value = residue;
				if (value >= blockSize) {
					LOCAL_UPDATER.set(this, service.getNewBlock(name, residue));
					RESIDUE_UPDATER.set(this, 0);
				}
				return newId();
			}
		}
		return local + value;
	}
}