# End-to-End Playwright Automation Testing Boilerplate

## Framework memory

The framework includes a local, deterministic knowledge base for AI agents and
maintainers. Start with [docs/KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md), then
retrieve task-specific context through `@MemoryKnowledgeBase`:

```ts
import memory from "@MemoryKnowledgeBase";

const context = memory.buildAgentContext("add GraphQL response validation");
```

Memory articles follow a fixed scaffold and use DNA fingerprints plus RNA
transcription for stable, model-independent retrieval identifiers.