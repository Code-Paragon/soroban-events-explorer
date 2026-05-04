# Soroban Events Explorer 🔍

> A lightning-fast, self-hostable event indexer and developer explorer for the Soroban smart contract platform.

[![Built with Soroban](https://img.shields.io/badge/Built_with-Soroban-blue.svg)](https://soroban.stellar.org/)

## The Vision
Developer Experience (DX) is the cornerstone of any thriving blockchain ecosystem. Currently, reading historical smart contract state and filtering events on Soroban requires heavy RPC queries. The **Soroban Events Explorer** provides developers with a plug-and-play local indexer. Spin it up, point it at your local or testnet network, and instantly view a real-time feed of your smart contract events.

This project is in its "V1 Minimum Viable Scaffold" stage, designed for open-source contributions via the Drips funding program.

## Architecture (Monorepo)
Managed via [Turborepo](https://turbo.build/repo/docs) and fully orchestrated with Docker Compose for immediate local hosting.

*   `packages/indexer` (Node.js): A background worker that polls the Stellar RPC and parses ledger events.
*   `packages/api` (Fastify): A high-performance API serving the indexed events to clients.
*   `packages/ui` (React/Vite): A dark-mode, terminal-style dashboard for viewing real-time event streams.

## Quick Start (Docker)

The easiest way to run the entire stack locally is using Docker Compose.

### Prerequisites
*   [Docker](https://www.docker.com/) & Docker Compose

### Running the Stack
1. Clone the repository:
   ```bash
   git clone [https://github.com/Soroban-Forge/soroban-events-explorer.git](https://github.com/Soroban-Forge/soroban-events-explorer.git)
   cd soroban-events-explorer
   ```
2. Spin up the infrastructure:
    ```bash
    docker-compose up --build
    ```
3. Open your browser to http://localhost:3000 to view the UI. The API runs on http://localhost:3001.

## Contributing
We want to build the best DX tooling in the Stellar ecosystem, and we need your help! See our CONTRIBUTING.md for a list of "Good First Issues."

## License
MIT