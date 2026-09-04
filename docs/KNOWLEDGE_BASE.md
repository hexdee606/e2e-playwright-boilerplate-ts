# Framework Knowledge Base

## Purpose

This knowledge base is the durable, agent-readable map of the Playwright-BDD
framework. It complements executable code; it does not replace source-of-truth
configuration or tests.

## Scaffold standard

Every memory article uses this structure:

1. **Identity**: stable `id`, title, and scope.
2. **Context**: the framework behavior or problem being addressed.
3. **When to use**: triggers for retrieval.
4. **Guidance**: concrete implementation rules.
5. **Constraints**: failure modes and non-negotiable behavior.
6. **Verification**: the command or assertion that proves the change.

Articles are mirrored in `utilities/MemoryKnowledgeBase.ts` so an AI agent can
retrieve them without parsing Markdown at runtime.

## Retrieval algorithm

1. Normalize the query into lowercase alphanumeric tokens.
2. Encode each token into an 8-base DNA fingerprint using a stable FNV-style hash.
3. Rank articles by shared normalized tokens.
4. Transcribe the selected DNA fingerprint to RNA (`A->U`, `C->G`, `G->C`,
   `T->A`) for a compact, deterministic context identifier.
5. Use `buildAgentContext(query)` to provide relevant guidance and constraints
   to an agent before it edits or diagnoses the framework.

This is intentionally deterministic and local: no credentials, network calls,
or model-specific API is required.

## Agent workflow

1. Retrieve memory for the task domain.
2. Inspect the linked source files and confirm the memory still matches code.
3. Make the smallest complete change that follows the article constraints.
4. Run the narrowest existing validation command.
5. Update the article and its TypeScript mirror when framework behavior changes.

## Current domains

- `framework-architecture`: BDD layout, configuration, and execution flow.
- `api-contracts`: REST/GraphQL helpers and Zod response contracts.
- `reliable-ui-actions`: page objects, shared actions, frames, and waits.
- `bdd-generation-and-agents`: source-of-truth files, generated output, agent roles, and validation commands.
