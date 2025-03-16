type EnvLog = {
    id:         string;
    deviceId:   string;
    value:      number;
    timestamp:  string;
};

type EnvLogUpdate = Partial<EnvLog>;
type EnvLogCreate = Omit<EnvLog, "id">;

export default EnvLog;
export { EnvLogUpdate, EnvLogCreate };