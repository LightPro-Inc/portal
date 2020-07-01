package com.infrastructure.core;

import java.io.IOException;

public interface Updatable<T> {
	void delete(T item) throws IOException;
}
