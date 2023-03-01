import { DemandStatus as DemandStatusEnum } from '@prisma/client';
import { z } from 'zod';

export { Demand } from '@prisma/client';

export const demandStatusSchema = z.nativeEnum(DemandStatusEnum);
export type DemandStatus = z.infer<typeof demandStatusSchema>;

export const databaseBrandSchema = z.literal('postgresql', {
    invalid_type_error: 'Такая база данных не поддерживается',
});
export type DatabaseBrand = z.infer<typeof databaseBrandSchema>;

export const databaseURISchema = z.string().url({ message: 'Неверный URI' });
export type DatabaseURI = z.infer<typeof databaseURISchema>;

export const anonymizingMethodSchema = z.union([
    z.literal('skip'),
    z.literal('mobile_phone'),
]);
export type AnonymizingMethod = z.infer<typeof anonymizingMethodSchema>;

export const suggestsSchema = z.record(
    z.string(),
    z.record(z.string(), anonymizingMethodSchema)
);
export type SuggestsSchema = z.infer<typeof suggestsSchema>;

export const databaseSchemaSchema = z.string();

export const migrationFileSchema = z.string();

export const createDemandDtoSchema = z.object({
    database: databaseBrandSchema,
    uri: databaseURISchema,
});
export type CreateDemandDto = z.infer<typeof createDemandDtoSchema>;

export const migrationPlanSchema = z.record(
    z.string(),
    z.record(z.string(), anonymizingMethodSchema)
);
export type MigrationPlan = z.infer<typeof migrationPlanSchema>;

export const updateDemandDtoSchema = z.object({
    status: z.optional(demandStatusSchema),
    suggests: z.optional(suggestsSchema),
    migration_file: z.optional(migrationFileSchema),
    schema: z.optional(databaseSchemaSchema),
    plan: z.optional(migrationPlanSchema),
});
export type UpdateDemandDtoSchema = z.infer<typeof updateDemandDtoSchema>;
