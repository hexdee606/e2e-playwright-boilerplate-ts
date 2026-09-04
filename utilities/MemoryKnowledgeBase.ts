/**
 * Deterministic project memory for human and AI test-framework agents.
 *
 * DNA is a stable base-4 fingerprint of normalized tokens. RNA is the
 * transcribed representation used for compact prompt/context identifiers.
 */

export interface MemoryArticle {
    id: string;
    title: string;
    summary: string;
    tags: string[];
    whenToUse: string[];
    guidance: string[];
    constraints: string[];
    verification: string[];
}

export interface MemoryMatch {
    article: MemoryArticle;
    score: number;
    dna: string;
    rna: string;
}

const articles: MemoryArticle[] = [
    {
        id: "framework-architecture",
        title: "Framework architecture and execution flow",
        summary: "Playwright runs BDD-generated tests from src, using ConfigSettings for paths, timeouts, reporters, and environment URLs.",
        tags: ["playwright", "bdd", "configuration", "architecture"],
        whenToUse: ["Adding a feature or step definition", "Changing execution, reporting, or environment behavior"],
        guidance: ["Keep feature files under src/**/features.", "Keep matching step definitions under src/**/step_definitions.", "Reuse page objects and utilities instead of putting selectors or transport logic in steps."],
        constraints: ["Run bddgen before Playwright tests.", "Do not hardcode environment URLs in scenarios or page objects."],
        verification: ["Run npm run test:generate-bdd, then the targeted Playwright test command."]
    },
    {
        id: "api-contracts",
        title: "API and GraphQL contract workflow",
        summary: "ApiHelper and GraphQLHelper centralize transport; Zod contracts validate response shapes at the BDD boundary.",
        tags: ["api", "graphql", "zod", "contracts", "request"],
        whenToUse: ["Adding REST or GraphQL coverage", "Diagnosing response parsing or contract failures"],
        guidance: ["Use the helper configured by envConf.", "Keep request models and operations in src/backend/services.", "Validate important response shapes with a Zod contract."],
        constraints: ["Preserve default headers and timeout behavior.", "Surface HTTP and GraphQL failures instead of returning silent fallbacks."],
        verification: ["Run the targeted backend feature with npm run test:e2e -- --grep <tag>."]
    },
    {
        id: "reliable-ui-actions",
        title: "Reliable UI actions and state",
        summary: "PlaywrightActions owns page and frame context; page objects own selectors and workflow semantics.",
        tags: ["ui", "playwright", "page-object", "iframe", "selector"],
        whenToUse: ["Adding UI interactions", "Working with iframes, waits, downloads, or uploads"],
        guidance: ["Set the page before using shared actions.", "Switch frame context explicitly and return to page context when needed.", "Prefer role, label, and stable test attributes over brittle CSS."],
        constraints: ["Do not bypass Playwright auto-waiting with arbitrary sleeps.", "Keep interaction errors contextual and rethrow them."],
        verification: ["Run the targeted UI feature and inspect the generated report."]
    }
];

const bases = ["A", "C", "G", "T"] as const;
const rnaMap: Record<typeof bases[number], string> = {A: "U", C: "G", G: "C", T: "A"};

function normalize(input: string): string[] {
    return input.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function tokenDna(token: string): string {
    let hash = 2166136261;
    for (const character of token) {
        hash ^= character.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }

    let dna = "";
    for (let index = 0; index < 8; index++) {
        dna += bases[hash >>> (index * 2) & 3];
    }
    return dna;
}

function fingerprint(input: string): string {
    return normalize(input).map(tokenDna).join("");
}

function transcribe(dna: string): string {
    return [...dna].map(base => rnaMap[base as typeof bases[number]]).join("");
}

function articleText(article: MemoryArticle): string {
    return [article.title, article.summary, ...article.tags, ...article.whenToUse, ...article.guidance, ...article.verification].join(" ");
}

class MemoryKnowledgeBase {
    private readonly entries = articles;

    list(): readonly MemoryArticle[] {
        return this.entries;
    }

    get(id: string): MemoryArticle {
        const article = this.entries.find(entry => entry.id === id);
        if (!article) {
            throw new Error(`Memory article not found: ${id}`);
        }
        return article;
    }

    encodeDNA(input: string): string {
        return fingerprint(input);
    }

    transcribeRNA(dna: string): string {
        return transcribe(dna);
    }

    recall(query: string, limit = 3): MemoryMatch[] {
        if (!query.trim()) {
            throw new Error("Memory query cannot be empty");
        }
        if (!Number.isInteger(limit) || limit < 1) {
            throw new Error("Memory result limit must be a positive integer");
        }

        const queryTokens = new Set(normalize(query));
        return this.entries
            .map(article => {
                const matches = normalize(articleText(article)).filter(token => queryTokens.has(token));
                const score = matches.length / Math.max(queryTokens.size, 1);
                const dna = fingerprint(`${article.id} ${article.title}`);
                return {article, score, dna, rna: transcribe(dna)};
            })
            .filter(match => match.score > 0)
            .sort((left, right) => right.score - left.score || left.article.id.localeCompare(right.article.id))
            .slice(0, limit);
    }

    buildAgentContext(query: string, limit = 3): string {
        return this.recall(query, limit)
            .map(({article, score, dna, rna}) =>
                [`[${article.id}] ${article.title} (relevance=${score.toFixed(2)}, DNA=${dna}, RNA=${rna})`,
                    `Summary: ${article.summary}`,
                    `Apply: ${article.guidance.join(" ")}`,
                    `Constraints: ${article.constraints.join(" ")}`,
                    `Verify: ${article.verification.join(" ")}`].join("\n"))
            .join("\n\n");
    }
}

export default new MemoryKnowledgeBase();
