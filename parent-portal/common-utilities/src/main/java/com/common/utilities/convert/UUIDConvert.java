package com.common.utilities.convert;

import java.util.UUID;

public class UUIDConvert {
	public static UUID fromObject(Object uuid){
		return uuid == null ? null : UUID.fromString(uuid.toString());
	}
}
