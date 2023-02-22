# Bleach

Сервис по деперсонализации баз данных

## Документация

### API

```
DatabaseBrand =
    | 'postgresql'

// TODO
Suggest = JSON

DemandStatus =
    | 'ON_EXPORTING'
    | 'ON_ANALYZING'
    | 'ON_VERIFICATION'
    | 'ON_MIGRATION_GENERATION'
    | 'DONE'

Demand = {
    id: number
    status: DemandStatus
    suggests: null | Suggest[]
    migration_file: null | string
}

CreateDemandDTO = {
    database: DatabaseBrand
    uri: string
}

GET /api/v1/demands () => Demand[]
POST /api/v1/demands CreateDemandDTO => Demand
```

### Messages

```
DatabaseBrand =
    | 'postgresql'

ON_EXPORTING = {
    demand_id: number
    database: DatabaseBrand
    uri: string
}

ON_ANALYZING = {
    demand_id: number
    columns: Record<string, string>
    samples: Record<string, unknown>[]
}
```
