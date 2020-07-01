package com.securities.api;

import java.io.IOException;

public interface ProfileFeature extends Feature {
	Profile profile() throws IOException;
}
