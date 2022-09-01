export enum AppEnv {
  PRODUCTION = 'production',
  STAGING = 'staging',
  TEST = 'test',
  LOCAL = 'local',
}

export type AppEnvDataMap<DataType> = {
  [key in AppEnv]?: DataType;
};
