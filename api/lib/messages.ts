import { type DatabaseBrand } from './schemas/demand';

export type OnExportingMessage = {
    demand_id: number;
    database_type: DatabaseBrand;
    db_name: string;
    user: string;
    password: string;
    host: string;
    port: string;
    schema: string;
};
