# Security Policy

## Supported versions

The latest default branch is the supported version. Older snapshots may not contain current security defaults.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or accidentally exposed credential. Contact the repository maintainers privately through the security contact configured in the GitHub repository. If private security reporting is not enabled, open a minimal issue that contains no exploit details or secrets and request a private channel.

Remove exposed credentials immediately, revoke or rotate them, and preserve only the minimum evidence needed for investigation.

## Framework security defaults

- Sensitive artifacts are disabled unless `E2E_CAPTURE_SENSITIVE_ARTIFACTS=true`.
- Unsafe Chromium flags require `E2E_ALLOW_UNSAFE_CHROMIUM=true`.
- Verbose logging requires `E2E_VERBOSE=true`.
- Credentials should be supplied through CI secret stores or local secret managers.
- Use `waitAndFillSensitiveInput` or `waitAndFillSensitiveInputFromEnv` for sensitive fields.
- Never commit `.env` files, tokens, passwords, cookies, traces, screenshots, videos, HAR files, or test reports containing private data.

Security controls reduce risk but cannot prevent an application from rendering sensitive data in its own DOM. Artifact retention and access must be controlled by the adopting organization.
