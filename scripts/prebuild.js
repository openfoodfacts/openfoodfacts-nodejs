import pkg from "../package.json" with { type: "json" };
import { writeFileSync } from "fs";

writeFileSync(
  "src/version.ts",
  `// auto-generated
export const VERSION = "${pkg.version}";
`,
);
