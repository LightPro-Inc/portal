package com.infrastructure.core;

import java.io.IOException;

public interface Oneness<T> {
	T id();
	boolean isPresent() throws IOException;
}
