import express from 'express';
import printEndpoints from 'express-list-endpoints';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import { connect } from 'nats';
import { QUEUE_URL } from './config';
import { v1Routes } from './api/v1';

const PORT = 3000;

export const prisma = new PrismaClient();
export const nats = connect({ servers: QUEUE_URL });

const app = express()
    .use(express.json())
    .use('/api/v1', v1Routes)
    .on('close', async () => {
        prisma.$disconnect();
        (await nats).drain();
    });

app.listen(PORT, () => {
    console.log(`running api on :${PORT}`);
    console.log(printEndpoints(app));
});
