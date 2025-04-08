// CREATE TABLE devices (
//     id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     user_id     UUID NOT NULL,
//     name        VARCHAR(100) NOT NULL,
//     type        VARCHAR(100) NOT NULL,
//     status      device_status DEFAULT 'off',
//     room        VARCHAR(100),
//     feet        VARCHAR(100) NOT NULL,
//     CONSTRAINT fk_device_user
//         FOREIGN KEY (user_id)
//         REFERENCES users (id)
//         ON DELETE CASCADE
// );

type Device = {
    id: string;
    user_id: string;
    name: string;
    type: string;
    room: string;
    feed_key: string;
    image_url: string;
    block_id: string;
    state: string;
    category: string;
};

type DeviceUpdate = Partial<Device>;

type DeviceCreate = {
    user_id: string;
    name: string;
    type: string;
    room: string;
    feed_key: string;
    block_id: string;
    category: string;
};

export interface Feed {
    name: string;
    description: string;
}

export default Device;
export { DeviceUpdate, DeviceCreate, Device };
