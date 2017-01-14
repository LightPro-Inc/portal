package com.securities.api;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface Taxes {
	Tax get(UUID id) throws IOException;
	List<Tax> all() throws IOException;
	Tax add(String name, String shortName, int rate) throws IOException;
	void delete(Tax item) throws IOException;
}
