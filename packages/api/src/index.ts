import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// V1 Scaffold: Mock Events Feed
fastify.get('/events', async (request, reply) => {
    // MOCK EXECUTION:
    // In a real deployment, this route would query the shared database
    // populated by the Indexer service.

    // GOOD FIRST ISSUE TODO:
    // 1. Set up a database connection (e.g., PostgreSQL/Prisma).
    // 2. Query the database for the latest events.
    // 3. Implement query parameters for pagination (?limit=10&cursor=xxx).
    // 4. Implement filtering by contract ID.

    return {
        status: "success",
        network: process.env.STELLAR_NETWORK || 'testnet',
        events: [
            { id: "event_1", contractId: "CC7...F3A", topic: "transfer", amount: "100 XLM", timestamp: Date.now() },
            { id: "event_2", contractId: "CDA...9BB", topic: "mint", amount: "5000 USDC", timestamp: Date.now() - 5000 }
        ]
    };
});

const start = async () => {
    try {
        // MUST bind to 0.0.0.0 for Docker networking to expose the port
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Soroban Events API listening on http://0.0.0.0:3001');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();