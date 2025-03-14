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
    status: "on" | "off" | "inactive";
    room: string;
    feet: string;
};

type DeviceUpdate = Partial<Device>;
type DeviceCreate = Omit<Device, "id">;

export interface BlockFeed {
    id: string; // A unique identifier for the feed association
    feed: any; // The feed key (e.g., "living-room-light-2")
    group: any; // The group the feed belongs to (e.g., "default")
}
export interface Block {
    name: string; // Display name for the block
    description: string; // A brief description of the block
    key: string; // Unique key for the block
    visual_type: string; // Visual type (set to "toggle" for a toggle block)
    size_x: number; // Width of the block (in grid units)
    size_y: number; // Height of the block (in grid units)
    block_feeds: BlockFeed[]; // Array of associated feeds
}

export interface Feed {
    name: string;
    description: string;
}

export default Device;
export { DeviceUpdate, DeviceCreate };
