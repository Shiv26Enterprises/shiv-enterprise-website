import { copyFile } from "node:fs/promises";

await copyFile("dist/server/index.mjs", "dist/server/index.js");
