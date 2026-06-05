import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2017",
  platform: "neutral",
  dts: { build: true },
  clean: true,
  exports: true,
  unbundle: true,
  outputOptions: {
    exports: "named",
  },
});
