import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const config: Config = {
  ...createDefaultPreset({
    tsconfig: "tsconfig.tests.json",
  }),
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  verbose: true,

  testMatch: ["**/tests/**/*.spec.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};

export default config;
