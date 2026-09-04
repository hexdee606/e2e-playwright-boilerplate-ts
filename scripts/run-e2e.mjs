import { spawnSync } from "node:child_process";

const playwrightArgs = process.argv.slice(2);

function run(command, args) {
    const executable =
        command === "npm" && process.env.npm_execpath
            ? process.execPath
            : command;
    const executableArgs =
        command === "npm" && process.env.npm_execpath
            ? [process.env.npm_execpath, ...args]
            : args;
    const result = spawnSync(executable, executableArgs, {
        stdio: "inherit",
        shell: false,
    });

    if (result.error) {
        console.error(result.error.message);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

run("npm", ["run", "clean:reports"]);
run("npm", ["exec", "--", "bddgen"]);
run("npm", ["exec", "--", "playwright", "test", ...playwrightArgs]);
run("npm", ["run", "security:scan-reports"]);
