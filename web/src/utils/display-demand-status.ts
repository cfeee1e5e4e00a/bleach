import { DemandStatus } from '@/entities/demand';
import { match } from 'ts-pattern';

export const displayDemandStatus = (status: DemandStatus) =>
    match<DemandStatus>(status)
        .with('ON_EXPORTING', () => 'Экспортируется')
        .with('ON_ANALYZING', () => 'Анализируется')
        .with('ON_VERIFICATION', () => 'Требуется валидация')
        .with('ON_MIGRATION_GENERATION', () => 'Генерируется миграция')
        .with('DONE', () => 'Обработана')
        .exhaustive();
