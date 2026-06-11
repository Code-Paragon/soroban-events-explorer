import { rpc } from '@stellar/stellar-sdk';

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const RPC_URL = process.env.RPC_URL || 'https://soroban-testnet.stellar.org';
const POLLING_INTERVAL_MS = 5000;
const EVENT_PAGE_LIMIT = 100;

console.log(`[Indexer] Starting Soroban Event Indexer on ${STELLAR_NETWORK}...`);
console.log(`[Indexer] Connecting to Stellar RPC at ${RPC_URL}`);

const server = new rpc.Server(RPC_URL);
let lastScannedLedger: number | undefined;

function eventToLogPayload(event: rpc.Api.EventResponse) {
    return {
        id: event.id,
        type: event.type,
        ledger: event.ledger,
        ledgerClosedAt: event.ledgerClosedAt,
        contractId: event.contractId?.toString(),
        txHash: event.txHash,
        topic: event.topic.map((topicPart) => topicPart.toXDR('base64')),
        value: event.value.toXDR('base64'),
    };
}

async function pollLedger() {
    try {
        const latestLedger = await server.getLatestLedger();
        const startLedger = lastScannedLedger === undefined
            ? latestLedger.sequence
            : lastScannedLedger + 1;

        if (startLedger > latestLedger.sequence) {
            console.log(`[Indexer] Ledger ${latestLedger.sequence} already scanned. Waiting for the next close.`);
            return;
        }

        const events = await server.getEvents({
            startLedger,
            endLedger: latestLedger.sequence + 1,
            filters: [{ type: 'contract' }],
            limit: EVENT_PAGE_LIMIT,
        });

        for (const event of events.events) {
            console.log('[Indexer] Soroban event', eventToLogPayload(event));
        }

        lastScannedLedger = latestLedger.sequence;
        console.log(`[Indexer] Scanned ledgers ${startLedger}-${latestLedger.sequence}. Found ${events.events.length} Soroban events.`);
    } catch (error) {
        console.error('[Indexer] Failed to poll Stellar RPC', error);
    }
}

// Start the polling loop
setInterval(pollLedger, POLLING_INTERVAL_MS);
void pollLedger();
