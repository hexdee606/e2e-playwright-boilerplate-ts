import fs from "node:fs";
import path from "node:path";

const roots = [
    "out/test-results",
    "out/logs"
];

const blockedPatterns = [
    {name: "Playwright fill action with raw value", pattern: /Fill\s+"[^"]+"\s+locator\(/i},
    {name: "Mock runtime username value", pattern: /mock-user-\d+/i},
    {name: "Bearer token", pattern: /\bBearer\s+(?!\[REDACTED\])[A-Za-z0-9._~+/=-]{8,}/i},
    {name: "Basic auth token", pattern: /\bBasic\s+(?!\[REDACTED\])[A-Za-z0-9+/=-]{8,}/i},
    {name: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/i},
    {name: "OpenAI-style API key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/i},
    {name: "AWS access key", pattern: /\b(AKIA|ASIA)[A-Z0-9]{16}\b/},
    {name: "Sensitive key assignment", pattern: /\b(password|passwd|pwd|token|secret|api[-_]?key|authorization|cookie|session|credential|otp|mfa)\s*[:=]\s*(?!\[REDACTED\])["']?[^"',\s;]{4,}/i}
];

const ignoredExtensions = new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".webm",
    ".zip"
]);

function* walk(directory) {
    if (!fs.existsSync(directory)) return;

    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            yield* walk(fullPath);
        } else if (!ignoredExtensions.has(path.extname(entry.name).toLowerCase())) {
            yield fullPath;
        }
    }
}

const findings = [];

for (const root of roots) {
    for (const filePath of walk(root)) {
        const content = fs.readFileSync(filePath, "utf8");
        for (const {name, pattern} of blockedPatterns) {
            if (pattern.test(content)) {
                findings.push(`${filePath}: ${name}`);
            }
        }
    }
}

if (findings.length > 0) {
    console.error("Sensitive data patterns were found in generated diagnostics:");
    findings.forEach(finding => console.error(`- ${finding}`));
    process.exit(1);
}

console.log("Generated diagnostics secret scan passed.");
