const path = require("path")
const { globSync } = require("glob")
const { build } = require("esbuild")
const { SERVER_URLS_AS_JSON } = require("./src/constants")

const defaultConfig = {
  entryPoints: [path.resolve(__dirname, "src/index.ts"), ...globSync("src/libs/**/index.ts")],
  bundle: process.env.NODE_ENV === "development",
  format: "esm",
  jsx: "automatic",
  outdir: "dist/esm",
  sourcemap: false,
  treeShaking: true,
  define: {
    ...SERVER_URLS_AS_JSON
  }
}

// Build ESM
build(defaultConfig).catch(() => process.exit(1))

// Build CJS
build({
  ...defaultConfig,
  format: "cjs",
  outdir: "dist/cjs",
  treeShaking: process.env.NODE_ENV === "development"
}).catch(() => process.exit(1))