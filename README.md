# qianqian
Product knowledge base for KTOS early education AI system.

qianqian is the product brain for KTOS: a shared knowledge base for product design, early education domain knowledge, AI prompts, event modeling, design system, development contracts, testing, and roadmap decisions.

This repository is managed like an open software project:

- every important idea has a version;
- every major decision has a decision record;
- every feature has one canonical document;
- every prompt, schema, UI rule, and API contract lives close to the product knowledge it depends on.

## Repository Map

```text
qianqian/
├── 00_Product/
├── 01_Research/
├── 02_EventEngine/
├── 03_AI/
├── 04_Design/
├── 05_Development/
├── 06_Test/
├── 07_Roadmap/
├── 08_Knowledge/
├── Decisions/
├── Features/
├── DOCUMENTATION_RULE.md
└── CHANGELOG.md
```

## Working Rule

One feature has one canonical document. Product, UI, prompt, data, API, test notes, and open questions for that feature should stay together in `Features/`.

Cross-cutting systems live in their own directories:

- `02_EventEngine/` defines how real kindergarten activity becomes structured AI-readable events.
- `03_AI/` defines prompts, memory, workflow, and agent behavior.
- `04_Design/` defines visual and interaction consistency.
- `08_Knowledge/` stores early education knowledge the AI and product team can cite.

Start here:

1. Read `00_Product/Product Constitution.md`.
2. Read `DOCUMENTATION_RULE.md`.
3. Read `02_EventEngine/Event Engine v1.md`.
4. Add new work as a canonical feature document or a decision record.
