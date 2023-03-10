import express from 'express';
import cors from 'cors';
import printEndpoints from 'express-list-endpoints';
import { connect } from 'nats';
import { QUEUE_URL } from './config';
import { v1Routes } from './api/v1';
import { prisma } from './prisma';

const PORT = 3000;

export const nats = connect({ servers: QUEUE_URL });

const app = express()
    .use(cors())
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
