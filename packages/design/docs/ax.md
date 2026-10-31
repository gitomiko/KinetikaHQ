# AX — Agent Experience

> *Where UX asks how humans use this — AX asks how an agent navigates this system, and how we design for both.*

---

## Background

The concept of AX (Agent Experience) was developed by **John Maeda** as an evolution of UX in the AI era. Where UX focuses on the experience of humans using a product, AX focuses on how AI agents — systems that can take actions independently — interact with, navigate, and "experience" a system.

This matters because more and more modern software isn't used only by humans directly, but also by agents acting on their behalf.

---

## AX in the Kinetika Context

Kinetika is built with AX as a design principle from the start, not as an afterthought.

**What this means in practice:**

Every component of the system — from configuration file structure, to the homelab API, to how Kinetika HQ exposes data — is designed to be read and operated by both humans and agents.

```
Kinetika System
    ├── Human Interface    → GNOME, Kinetika HQ dashboard
    ├── Agent Interface    → Consistent data structures, documented APIs
    └── Shared Layer       → The "nothing is hidden" philosophy applies to both
```

---

## The Three AX Questions

When designing a new component in the Kinetika ecosystem, always ask:

**1. Can an agent understand this structure?**
Data, configuration, and system output must have a consistent, predictable structure.

**2. Can an agent take meaningful action?**
An interface must be not only *readable* but also *actionable* — an agent should be able to do something useful.

**3. Can the result be verified by a human?**
Good AX doesn't remove the human from the loop. It lets humans verify, correct, and learn from what the agent does.

---

## AX vs UX vs CX

| Dimension | UX | CX | AX |
|---|---|---|---|
| **Subject** | Human user | Customer | AI agent |
| **Medium** | Visual interface | The whole journey | API, structure, data |
| **Goal** | Ease of use | Overall satisfaction | Navigability + actionability |
| **Error handling** | Clear error messages | Recovery experience | Structured failure states |

---

## Current Implementation

| Component | AX Consideration |
|---|---|
| **Kinetika HQ** | Service data structure exposed consistently per category |
| **Kost HQ** | WhatsApp as a natural-language interface for agents |
| **ir0nm0nk node** | A node in the mesh that can be queried and operated programmatically |
| **KinetikaOS** | System configuration in machine-readable formats (dotfiles, scripts) |

---

## AX Roadmap

- [ ] Standardize data formats across Kinetika components
- [ ] API layer for Kinetika HQ
- [ ] Agent-friendly CLI for homelab operations
- [ ] "Agent contract" documentation for each component

---

## Further Reading

- John Maeda — *Design in Tech Report* (2015–2019)
- The concept of *agentic AI* in the context of modern LLMs
- → [`philosophy.md`](./philosophy.md) for broader context
