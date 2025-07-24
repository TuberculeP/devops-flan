import { Config } from "jest";
import { createDefaultPreset }  from "ts-jest";

const defaultPreset = createDefaultPreset();

const config: Config = {
  testEnvironment: "node",
  transform: defaultPreset.transform
};

export default config;
