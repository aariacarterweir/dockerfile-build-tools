const path = require("path");
const packagePath = path.join(process.cwd(), "package.json");
const packageJson = require(packagePath);

console.log(packageJson.version);
