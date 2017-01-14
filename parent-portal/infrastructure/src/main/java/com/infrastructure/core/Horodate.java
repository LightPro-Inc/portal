package com.infrastructure.core;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

public interface Horodate {
	Date dateCreated() throws IOException;
	Date lastModifiedDate() throws IOException;
	UUID lastModifierId() throws IOException;
	UUID ownerId() throws IOException;
}
