# Contributing to Soroban Forge

Welcome! We are building core developer infrastructure for the Stellar network, and we are excited to have you contribute.

## How to Contribute
1.  **Find an Issue:** Look for issues tagged `good first issue`, `indexer`, `api`, or `frontend`.
2.  **Fork and Branch:** Create a feature branch (`git checkout -b feat/your-feature`).
3.  **Code:** Implement your solution.
4.  **Test:** Ensure your changes build and that the `docker-compose up` command still successfully spins up the stack.
5.  **Submit a PR:** Open a Pull Request!

## Key Areas Needing Contribution
*   **Indexer (`packages/indexer`):** The polling loop is currently a mock. We need a contributor to integrate `@stellar/stellar-sdk` and implement the actual RPC block parsing.
*   **Database Integration (`packages/api` & `packages/indexer`):** Both the API and Indexer need to be wired up to a shared database (like PostgreSQL/Prisma) so the parsed events can be persisted and queried.
*   **Frontend UI (`packages/ui`):** The React frontend currently relies on mock state. It needs to be wired up to the API via standard HTTP fetching or, ideally, WebSockets for real-time updates.