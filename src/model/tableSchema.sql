-- Enable the UUID extension (run once per database)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) USERS TABLE
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username    VARCHAR(100) NOT NULL,
    password    VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    avatar_url  VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2) DEVICES TABLE

CREATE TABLE devices (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL,
    name        VARCHAR(100) UNIQUE NOT NULL, -- Map to the device name - block name
    type        VARCHAR(100) NOT NULL,
    room        VARCHAR(100),
    feed_key        VARCHAR(100) UNIQUE  NOT NULL , -- Map to the device feedKey - feedKey
    image_url   VARCHAR(255),
    CONSTRAINT fk_device_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);


-- 4) ENVIRONMENTAL LOG TABLE
CREATE TABLE status_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id   UUID NOT NULL,
    value       INT NOT NULL,
    timestamp   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_environmentallog_device
        FOREIGN KEY (device_id)
        REFERENCES devices (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 5) AUTOMATION SCENARIOS TABLE
CREATE TABLE automation_scenarios (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id   UUID NOT NULL,
    name        VARCHAR(100) NOT NULL,
    low         INT NOT NULL,
    high        INT NOT NULL,
    
    action      VARCHAR(100) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_automationscenarios_device
        FOREIGN KEY (device_id)
        REFERENCES devices (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
