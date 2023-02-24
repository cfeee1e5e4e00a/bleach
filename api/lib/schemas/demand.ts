import { DemandStatus } from '@prisma/client';
import { z } from 'zod';

export const demandStatusScheme = z.nativeEnum(DemandStatus);

export const databaseBrandSchema = z.literal('postgresql');
export type DatabaseBrand = z.infer<typeof databaseBrandSchema>;

export const databaseURISchema = z.string();
export type DatabaseURI = z.infer<typeof databaseURISchema>;

export const suggestsSchema = z.unknown();

export const migrationFileSchema = z.string();

export const createDemandDtoSchema = z.object({
    database: databaseBrandSchema,
    uri: databaseURISchema,
});

export const updateDemandDtoSchema = z.object({
    status: z.optional(demandStatusScheme),
    suggests: z.optional(suggestsSchema),
    migration_file: z.optional(migrationFileSchema),
});
