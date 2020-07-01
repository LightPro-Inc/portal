package com.securities.api;

import java.io.IOException;

public interface FeatureSubscribed extends Feature {
	Module module() throws IOException;
}
