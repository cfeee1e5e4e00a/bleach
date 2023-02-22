import { DemandStatus } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import HttpStatus from 'http-status';
import { StringCodec } from 'nats';
import { nats, prisma } from '../..';

const demandStatusScheme = z.nativeEnum(DemandStatus);

const databaseBrandSchema = z.literal('postgresql');
type DatabaseBrand = z.infer<typeof databaseBrandSchema>;

const databaseURISchema = z.string();
type DatabaseURI = z.infer<typeof databaseURISchema>;

const suggestsSchema = z.unknown();

const migrationFileSchema = z.string();

const createDemandDtoSchema = z.object({
    database: databaseBrandSchema,
    uri: databaseURISchema,
});

const updateDemandDtoSchema = z.object({
    status: z.optional(demandStatusScheme),
    suggests: z.optional(suggestsSchema),
    migration_file: z.optional(migrationFileSchema),
});

type OnExportingMessage = {
    demand_id: number;
    database: DatabaseBrand;
    uri: DatabaseURI;
};

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

    const { database, uri } = dto.data;

    const demand = await prisma.demand.create({
        data: { status: 'ON_EXPORTING' },
    });

    const message: OnExportingMessage = {
        demand_id: demand.id,
        database,
        uri,
    };

    (await nats).publish(
        'ON_EXPORTING',
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
