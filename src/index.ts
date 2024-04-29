import fs from "node:fs";
import child_process from "node:child_process";
import { GITIGNORE, INDEX, INDEX_TEST, JEST_CONFIG, LICENSE, README, TSUP_CONFIG, TS_CONFIG } from "./strings";

export default function init() {
  exec("git init");
  exec("npm init -y");
  exec("tsc --init");
  exec("npm i -D ts-node tsup typescript jest @types/jest ts-jest");
  mkdir("src");
  write("src/index.ts", INDEX);
  write("src/index.test.ts", INDEX_TEST);
  write("README.md", README);
  write(".gitignore", GITIGNORE);
  write("LICENSE", LICENSE);
  write("tsup.config.ts", TSUP_CONFIG);
  write("jest.config.ts", JEST_CONFIG);
  write("tsconfig.json", TS_CONFIG);
  update_package_json();
}

function exec(cmd: string) {
  console.log("\x1b[33m%s\x1b[0m", "exec", cmd);
  return child_process.execSync(cmd);
}

function mkdir(path: string) {
  console.log("\x1b[34m%s\x1b[0m", "mkdir", path);
  return fs.mkdirSync(path, {recursive: true});
}

function write(path: string, text = "") {
  console.log("\x1b[32m%s\x1b[0m", "write", path);
  fs.writeFileSync(path, text, {encoding: "utf-8"});
}

function update_package_json() {
  const text = fs.readFileSync("package.json", {encoding: "utf-8"});
  const json = JSON.parse(text);
  json["license"] = "CC0-1.0";
  json["main"] = "dist/index.js";
  json["types"] = "dist/index.d.ts";
  json["files"] = ["dist/**"];
  json["scripts"] = {
    build: "tsup",
    test: "jest",
  };
  write("package.json", JSON.stringify(json, null, 2));
}
