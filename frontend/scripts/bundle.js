"use strict";

const fs = require("fs");
const path = require("path");

const SCRIPTS_DIR = __dirname;
const JS_DIR = path.join(SCRIPTS_DIR, "..", "src", "js");
const ENTRY = path.join(JS_DIR, "main.js");
const OUT = path.join(JS_DIR, "app.js");

const importPattern = /import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;?/g;
const exportNamePatterns = [
  /\bexport\s+(?:class|function)\s+([A-Za-z_$][\w$]*)/g,
  /\bexport\s+const\s+([A-Za-z_$][\w$]*)/g,
];

const factories = new Map();
const ids = new Map();

function build(absPath) {
  if (factories.has(absPath)) {
    return;
  }
  const content = fs.readFileSync(absPath, "utf8");
  const dir = path.dirname(absPath);
  const body = content.replace(importPattern, (match, names, spec) => {
    const target = path.resolve(dir, spec);
    build(target);
    return "const { " + names.trim().split(/\s*,\s*/).filter(Boolean).join(", ") +
      " } = __require(" + JSON.stringify(idOf(target)) + ");";
  });
  const exported = [];
  for (const pattern of exportNamePatterns) {
    body.replace(pattern, (match, name) => {
      exported.push(name);
      return match;
    });
  }
  const cleaned = body.replace(/(^\s*)export\s+/gm, "$1");
  const uniques = Array.from(new Set(exported));
  const factory = cleaned + "\n  module.exports = { " + uniques.join(", ") + " };\n";
  factories.set(absPath, factory);
}

function idOf(absPath) {
  if (!ids.has(absPath)) {
    ids.set(absPath, path.relative(JS_DIR, absPath).replace(/\\/g, "/"));
  }
  return ids.get(absPath);
}

build(ENTRY);

const lines = [];
lines.push("/* Generado desde los ES modules de src/js. No editar a mano. Regenerar: node scripts/bundle.js */");
lines.push("(function () {");
lines.push("  var __modules = {};");
lines.push("  var __cache = {};");
lines.push("  function __require(id) {");
lines.push("    if (__cache[id]) { return __cache[id].exports; }");
lines.push("    var module = { exports: {} };");
lines.push("    __cache[id] = module;");
lines.push("    __modules[id].call(module.exports, module.exports, module, __require);");
lines.push("    return module.exports;");
lines.push("  }");
for (const [absPath, factory] of factories) {
  lines.push("  __modules[" + JSON.stringify(idOf(absPath)) + "] = function (exports, module, __require) {");
  lines.push(factory);
  lines.push("  };");
}
lines.push("  __require(" + JSON.stringify(idOf(ENTRY)) + ");");
lines.push("})();");

fs.writeFileSync(OUT, lines.join("\n") + "\n");