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
    schema: DatabaseSchema;
};

export type DemanOnVerification = {
    id: number;
    status: 'ON_VERIFICATION';
    uri: DatabaseURI;
    schema: DatabaseSchema;
    suggests: object;
};

export type Demand =
    | DemandOnExporting
    | DemandOnAnalyzing
    | DemanOnVerification;

export type DemandStatus = Demand['status'];

export const databaseBrandSchema = z.literal('postgresql', {
    invalid_type_error: 'Такая база данных не поддерживается',
});
export type DatabaseBrand = z.infer<typeof databaseBrandSchema>;

export const databaseURISchema = z.string().url({ message: 'Неверный URI' });
export type DatabaseURI = z.infer<typeof databaseURISchema>;

export type DatabaseSchemaColumn = {
    human_type: string;
    type: string;
    is_nullable: boolean;
    column_name: string;
    example_data: string[];
};

export type DatabaseSchema = Record<string, DatabaseSchemaColumn>;

export const createDemandDtoSchema = z.object({
    database: databaseBrandSchema,
    uri: databaseURISchema,
});
export type CreateDemandDto = z.infer<typeof createDemandDtoSchema>;
