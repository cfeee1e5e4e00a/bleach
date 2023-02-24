import { type DatabaseBrand, type DatabaseURI } from './schemas/demand';

export type OnExportingMessage = {
    demand_id: number;
    database: DatabaseBrand;
    uri: DatabaseURI;
};
