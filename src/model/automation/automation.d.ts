type Automation = {
    id: string; // UUID generated via uuid_generate_v4()
    deviceId: string; // References devices.id
    name: string; // VARCHAR(100)
    low: number; // INT
    high: number; // INT
    action: string; // VARCHAR(100)
    isActive: boolean; // BOOLEAN, default TRUE
    createdAt: Date; // TIMESTAMP WITH TIME ZONE
    category: string; // VARCHAR(100), default 'light' or 'smoke'
};

type AutomationUpdate = Partial<Automation>;
type AutomationCreate = Omit<Automation, "id", "createdAt">;

export default Automation;
export { AutomationUpdate, AutomationCreate };
