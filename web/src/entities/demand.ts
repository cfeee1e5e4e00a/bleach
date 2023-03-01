import { stringUnionToArray } from '@/utils/string-union-to-array';
import { z } from 'zod';

export type DemandOnExporting = {
    id: number;
    status: 'ON_EXPORTING';
    uri: DatabaseURI;
};

export type DemandOnAnalyzing = {
    id: number;
    status: 'ON_ANALYZING';
    uri: DatabaseURI;
    schema: { schema: DatabaseSchema };
};

export type DemandOnVerification = {
    id: number;
    status: 'ON_VERIFICATION';
    uri: DatabaseURI;
    schema: { schema: DatabaseSchema };
    suggests: DatabaseSuggest[];
};

export type DemandOnMigrationGeneration = {
    id: number;
    status: 'ON_MIGRATION_GENERATION';
    uri: DatabaseURI;
    schema: { schema: DatabaseSchema };
    suggests: DatabaseSuggest[];
    plan: MigrationPlan;
};

export type Demand =
    | DemandOnExporting
    | DemandOnAnalyzing
    | DemandOnVerification
    | DemandOnMigrationGeneration;

export type DemandStatus = Demand['status'];

export type DatabaseSchemaColumn = {
    human_type: string;
    type: string;
    is_nullable: boolean;
    column_name: string;
    example_data: string[];
};

export const anonymizingMethods = stringUnionToArray<AnonymizingMethod>()(
    'skip',
    'passport',
    'email',
    'phone',
    'birth date',
    'fio',
    'ipv4',
    'ipv6',
    'mac',
    'inn',
    'index',
    'region',
    'ts',
    'bank card'
);

export const anonymizingMethodSchema = z.union([
    z.literal('skip'),
    z.literal('passport'),
    z.literal('email'),
    z.literal('phone'),
    z.literal('birth date'),
    z.literal('fio'),
    z.literal('ipv4'),
    z.literal('ipv6'),
    z.literal('mac'),
    z.literal('inn'),
    z.literal('index'),
    z.literal('region'),
    z.literal('ts'),
    z.literal('bank card'),
]);
export type AnonymizingMethod = z.infer<typeof anonymizingMethodSchema>;

export const migrationPlanSchema = z.record(
    z.string(),
    z.record(z.string(), anonymizingMethodSchema)
);
export type MigrationPlan = z.infer<typeof migrationPlanSchema>;

export type DatabaseSuggest = {
    table: string;
    column: string;
    method: AnonymizingMethod;
};

export type DatabaseSchema = Record<string, DatabaseSchemaColumn[]>;

export const databaseBrandSchema = z.literal('postgresql', {
    invalid_type_error: 'Такая база данных не поддерживается',
});
export type DatabaseBrand = z.infer<typeof databaseBrandSchema>;

export const databaseURISchema = z.string().url({ message: 'Неверный URI' });
export type DatabaseURI = z.infer<typeof databaseURISchema>;

export const createDemandDtoSchema = z.object({
    database: databaseBrandSchema,
    uri: databaseURISchema,
});
export type CreateDemandDto = z.infer<typeof createDemandDtoSchema>;

export const submitDemandVerificationDtoSchema = z.object({
    status: z.literal('ON_MIGRATION_GENERATION'),
    plan: migrationPlanSchema,
});

export type SubmitDemandVerificationDto = z.infer<
    typeof submitDemandVerificationDtoSchema
>;
