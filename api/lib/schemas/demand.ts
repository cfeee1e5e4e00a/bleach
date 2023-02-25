import { DemandStatus as DemandStatusEnum } from '@prisma/client';
import { z } from 'zod';

export { Demand } from '@prisma/client';

export const demandStatusScheme = z.nativeEnum(DemandStatusEnum);
export type DemandStatus = z.infer<typeof demandStatusScheme>;

export const databaseBrandSchema = z.literal('postgresql', {
    invalid_type_error: 'Такая база данных не поддерживается',
});
export type DatabaseBrand = z.infer<typeof databaseBrandSchema>;

export const databaseURISchema = z.string().url({ message: 'Неверный URI' });
export type DatabaseURI = z.infer<typeof databaseURISchema>;

export const suggestsSchema = z.unknown();

export const migrationFileSchema = z.string();

export const createDemandDtoSchema = z.object({
    database: databaseBrandSchema,
    uri: databaseURISchema,
});
export type CreateDemandDto = z.infer<typeof createDemandDtoSchema>;

export const updateDemandDtoSchema = z.object({
    status: z.optional(demandStatusScheme),
    suggests: z.optional(suggestsSchema),
    migration_file: z.optional(migrationFileSchema),
});
export type UpdateDemandDtoSchema = z.infer<typeof updateDemandDtoSchema>;
