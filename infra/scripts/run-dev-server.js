const { spawn, execSync } = require("node:child_process");

function runDevServer() {
  spawn("npm", ["run", "dev:up"], {
    killSignal: "SIGINT",
    stdio: "inherit",
  });

  process.on("SIGINT", () => {
    process.stdout.write("\n🛑 Stopping services...");
    execSync("npm run services:stop");
  });
}

runDevServer();
