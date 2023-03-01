import EventEmitter from 'node:events';
import { Router } from 'express';
import HttpStatus from 'http-status';
import { StringCodec } from 'nats';
import * as URI from 'uri-js';
import { match, P } from 'ts-pattern';
import {
    type OnExportingMessage,
    type Demand,
    createDemandDtoSchema,
    updateDemandDtoSchema,
    OnMigrationGenerationMessage,
} from '../../../lib';
import { nats } from '../..';
import { prisma } from '../../prisma';

class DemandsUpdatesBus extends EventEmitter {}

const demandsUpdates = new DemandsUpdatesBus();

prisma.$connect().then(() => {
    console.log('registered demands middleware');
    prisma.$use(async (params, next) => {
        const result = await next(params);

        match({ params, result })
            .with(
                {
                    params: {
                        model: 'Demand',
                        action: P.union('update', 'create'),
                    },
                },
                ({ result }) => {
                    demandsUpdates.emit('data', result);
                }
            )
            .otherwise(() => {});

        return result;
    });
});

export const demandsRoutes = Router();

demandsRoutes.get('/', async (req, res) => {
    const demands = await prisma.demand.findMany();

    return res.send(demands);
});

demandsRoutes.get('/events', async (req, res) => {
    res.writeHead(HttpStatus.OK, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
    });

    const dataHandler = (data: Demand) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    demandsUpdates.on('data', dataHandler);

    req.on('close', () => {
        demandsUpdates.removeListener('data', dataHandler);
    });
});

demandsRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;

    const demand = await prisma.demand.findUnique({
        where: { id: Number(id) },
    });

    if (!demand) {
        return res.status(HttpStatus.NOT_FOUND);
    } else {
        return res.send(demand);
    }
});

demandsRoutes.get('/:id/events', async (req, res) => {
    const { id } = req.params;

    res.writeHead(HttpStatus.OK, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
    });

    const dataHandler = (data: Demand) => {
        if (data.id === Number(id)) {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    };

    demandsUpdates.addListener('data', dataHandler);

    req.on('close', () => {
        demandsUpdates.removeListener('data', dataHandler);
    });
});

demandsRoutes.post('/', async (req, res) => {
    const dto = await createDemandDtoSchema.safeParseAsync(req.body);

    if (dto.success === false) {
        return res.status(HttpStatus.BAD_REQUEST).send(dto.error);
    }

    const { database: databaseType, uri } = dto.data;

    const demand = await prisma.demand.create({
        data: {
            status: 'ON_EXPORTING',
            uri,
        },
    });

    const { host, port, userinfo, path: databaseName, query } = URI.parse(uri);

    const scheme = new URLSearchParams(query).get('scheme');

    const [user, password] = userinfo!.split(':');

    const message: OnExportingMessage = {
        demand_id: demand.id,
        database_type: databaseType,
        schema: scheme!,
        host: host!,
        port: String(port!),
        user,
        password,
        db_name: databaseName!.replace('/', ''),
    };

    (await nats).publish(
        'OnExporting',
        StringCodec().encode(JSON.stringify(message))
    );

    console.log(
        new Date().toDateString(),
        'sended OnExportingMessage',
        message
    );

    return res.send(demand);
});

demandsRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;

    const dto = await updateDemandDtoSchema.safeParseAsync(req.body);

    if (dto.success === false) {
        console.error('Bad request', req.url, req.body);
        return res.status(HttpStatus.BAD_REQUEST).send(dto.error);
    }

    const { migration_file, status, suggests, schema, plan } = dto.data;

    const demand = await prisma.demand.update({
        where: { id: Number(id) },
        data: {
            status,
            migration_file,
            suggests: suggests ? JSON.parse(suggests) : undefined,
            schema: schema ? JSON.parse(schema) : undefined,
            plan,
        },
    });

    if (status === 'ON_MIGRATION_GENERATION' && plan) {
        const message: OnMigrationGenerationMessage = {
            demand_id: Number(id),
            plan,
            uri: demand.uri!,
        };

        (await nats).publish(
            'OnMigrationGeneration',
            StringCodec().encode(JSON.stringify(message))
        );

        console.log(
            new Date().toDateString(),
            'sended OnMigrationGenerationMessage',
            message
        );
    }

    return demand;
});
