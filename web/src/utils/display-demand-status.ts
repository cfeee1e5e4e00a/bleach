import { DemandStatus } from '@/entities/demand';
import { match } from 'ts-pattern';

export const displayDemandStatus = (status: DemandStatus) =>
    match<DemandStatus>(status)
        .with('ON_EXPORTING', () => 'экспортируется')
        .with('ON_ANALYZING', () => 'анализируется')
        .with('ON_VERIFICATION', () => 'требуется валидация')
        .with('ON_MIGRATION_GENERATION', () => 'генерируется миграция')
        .with('DONE', () => 'обработана')
        .exhaustive();
