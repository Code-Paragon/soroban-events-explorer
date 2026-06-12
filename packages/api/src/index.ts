import Fastify from 'fastify';
import { prisma } from '@soroban-forge/db';

const fastify = Fastify({ logger: true });

// Handle CORS for frontend clients
fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') {
        return reply.status(204).send();
    }
});

// V1 Scaffold: Dynamic Events Feed from DB
fastify.get('/events', async (request, reply) => {
    const query = request.query as { limit?: string; offset?: string; contractId?: string };
    
    // Parse pagination parameters
    let limit = parseInt(query.limit || '10', 10);
    let offset = parseInt(query.offset || '0', 10);
    
    if (isNaN(limit) || limit < 1) {
        limit = 10;
    }
    if (isNaN(offset) || offset < 0) {
        offset = 0;
    }
    
    // Safety cap on page size
    if (limit > 100) {
        limit = 100;
    }

    const where: any = {};
    if (query.contractId) {
        where.contractId = query.contractId;
    }

    try {
        const events = await prisma.event.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: {
                timestamp: 'desc',
            },
        });

        const total = await prisma.event.count({ where });

        return {
            status: "success",
            network: process.env.STELLAR_NETWORK || 'testnet',
            pagination: {
                limit,
                offset,
                total,
            },
            events,
        };
    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
            status: "error",
            message: "Failed to retrieve events from database",
        });
    }
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