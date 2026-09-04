const REDACTED = "[REDACTED]";

const SENSITIVE_KEY_PATTERN =
    /authorization|cookie|set-cookie|password|passwd|pwd|token|secret|api[-_]?key|access[-_]?key|refresh[-_]?token|id[-_]?token|session|credential|otp|mfa|private[-_]?key/i;

const SENSITIVE_TEXT_PATTERNS: Array<[RegExp, string]> = [
    [/\bBearer\s+[a-z0-9._~+/=-]+/gi, `Bearer ${REDACTED}`],
    [/\bBasic\s+[a-z0-9+/=-]+/gi, `Basic ${REDACTED}`],
    [/\b(AKIA|ASIA)[A-Z0-9]{16}\b/g, REDACTED],
    [/\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g, REDACTED],
    [/\bsk-[A-Za-z0-9_-]{20,}\b/g, REDACTED],
    [
        /\b([A-Za-z0-9_-]*?(?:password|passwd|pwd|token|secret|api[-_]?key|authorization|cookie|session|credential|otp|mfa)[A-Za-z0-9_-]*?)\s*[:=]\s*("[^"]*"|'[^']*'|[^\s,;]+)/gi,
        `$1=${REDACTED}`,
    ],
    [
        /([?&](?:password|passwd|pwd|token|secret|api[-_]?key|authorization|cookie|session|credential|otp|mfa)=)[^&#\s]+/gi,
        `$1${REDACTED}`,
    ],
];

const knownSecretValues = new Set<string>();
let consoleRedactionInstalled = false;

function collectEnvironmentSecrets(): void {
    Object.entries(process.env).forEach(([key, value]) => {
        if (value && value.length >= 4 && SENSITIVE_KEY_PATTERN.test(key)) {
            knownSecretValues.add(value);
        }
    });
}

export function registerSensitiveValue(value: unknown): void {
    if (typeof value === "string" && value.length >= 4) {
        knownSecretValues.add(value);
    }
}

export function redactSensitiveText(value: string): string {
    collectEnvironmentSecrets();

    let safeValue = value;
    for (const [pattern, replacement] of SENSITIVE_TEXT_PATTERNS) {
        safeValue = safeValue.replace(pattern, replacement);
    }

    for (const secret of knownSecretValues) {
        safeValue = safeValue.split(secret).join(REDACTED);
    }

    return safeValue;
}

export function redactValue<T>(
    value: T,
    seen = new WeakSet<object>(),
): T | unknown {
    if (typeof value === "string") return redactSensitiveText(value);
    if (
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null ||
        value === undefined
    )
        return value;
    if (value instanceof Error) return redactError(value);
    if (Array.isArray(value))
        return value.map((item) => redactValue(item, seen));

    if (typeof value === "object") {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);

        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(
                ([key, item]) => [
                    key,
                    SENSITIVE_KEY_PATTERN.test(key)
                        ? REDACTED
                        : redactValue(item, seen),
                ],
            ),
        );
    }

    return value;
}

export function redactError(error: Error): Error {
    const safeError = new Error(redactSensitiveText(error.message));
    safeError.name = error.name;
    if (error.stack) safeError.stack = redactSensitiveText(error.stack);
    return safeError;
}

export function secureError(message: string, cause?: unknown): Error {
    const safeMessage = redactSensitiveText(message);
    if (!cause) return new Error(safeMessage);

    const causeMessage = cause instanceof Error ? cause.message : String(cause);
    return new Error(`${safeMessage}: ${redactSensitiveText(causeMessage)}`);
}

export function installConsoleRedaction(): void {
    if (consoleRedactionInstalled) return;
    consoleRedactionInstalled = true;

    (["debug", "error", "info", "log", "trace", "warn"] as const).forEach(
        (method) => {
            const original = console[method].bind(console);
            console[method] = (...args: unknown[]) =>
                original(...args.map((argument) => redactValue(argument)));
        },
    );
}
