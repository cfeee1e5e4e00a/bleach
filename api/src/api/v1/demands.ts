import EventEmitter from 'node:events';
import { Router } from 'express';
import HttpStatus from 'http-status';
import { StringCodec } from 'nats';
import * as URI from 'uri-js';
import {
    type OnExportingMessage,
    createDemandDtoSchema,
    updateDemandDtoSchema,
} from '../../../lib';
import { nats, prisma } from '../..';

class DemandsUpdatesBus extends EventEmitter {}

const demandsUpdates = new DemandsUpdatesBus();

// prisma.$use(async (params, next) => {
//     const result = await next(params);

//     console.log(result);

//     // if (params?.model === 'Demand') {
//     //     demandsUpdates.emit('')
//     // }

//     return result;
// });

export const demandsRoutes = Router();

demandsRoutes.get('/', async (req, res) => {
    const demands = await prisma.demand.findMany();

    return res.send(demands);
});

demandsRoutes.post('/', async (req, res) => {
    const dto = await createDemandDtoSchema.safeParseAsync(req.body);

    if (dto.success === false) {
        return res.status(HttpStatus.BAD_REQUEST).send(dto.error);
    }

    const { database: databaseType, uri } = dto.data;

    const demand = await prisma.demand.create({
        data: { status: 'ON_EXPORTING' },
    });

    const { scheme, host, port, userinfo, path: databaseName } = URI.parse(uri);

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
        return res.status(HttpStatus.BAD_REQUEST).send(dto.error);
    }

    const { migration_file, status, suggests } = dto.data;

    const demand = await prisma.demand.update({
        where: { id: Number(id) },
        data: { status, migration_file, suggests: suggests as object },
    });

    return demand;
});
