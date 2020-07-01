package com.infrastructure.core;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

public interface Horodate {
	LocalDateTime dateCreated() throws IOException;
	LocalDateTime lastModifiedDate() throws IOException;
	UUID lastModifierId() throws IOException;
	UUID ownerId() throws IOException;
	UUID ownerCompanyId() throws IOException;
}
