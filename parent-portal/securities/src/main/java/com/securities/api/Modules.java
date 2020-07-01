package com.securities.api;

import java.io.IOException;
import java.util.UUID;

import com.infrastructure.core.AdvancedQueryable;

/**
 * Modules manager of a company
 * @author oob
 *
 */

public interface Modules extends AdvancedQueryable<Module, Integer> {
	Module get(UUID id) throws IOException;
	Module get(ModuleType type) throws IOException;
	boolean contains(ModuleType type) throws IOException;
	Modules of(Company company) throws IOException;
	Modules of(ModuleType type) throws IOException;
	Modules of(ModuleState state) throws IOException;
	Modules of(ModuleStatus status) throws IOException;
}