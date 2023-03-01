import { Database } from '@/containers/database';
import { MigrationPlan } from '@/entities/demand';
import { useDemandById } from '@/hooks/useDemandById';
import { displayDemandStatus } from '@/utils/display-demand-status';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

export const DemandPage: FC = () => {
    const { id } = useParams();

    const { demand, submitVerification } = useDemandById(id);

    const [plan, setPlan] = useState<MigrationPlan>({});

    if (!demand) {
        return (
            <main className="flex items-center justify-center md:p-12 flex-grow w-full">
                <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl"></div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center flex-grow w-full md:p-12 gap-8">
            <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-3xl">
                    Заявка #{id} - {displayDemandStatus(demand.status)}
                </h1>
                {demand.status === 'ON_VERIFICATION' && (
                    <button
                        className="px-8 py-2 rounded-md transition duration-75 hover:scale-110 bg-green-500 text-xl text-white"
                        onClick={() =>
                            submitVerification({
                                status: 'ON_MIGRATION_GENERATION',
                                plan,
                            })
                        }
                    >
                        Готово
                    </button>
                )}
            </div>
            {demand.status === 'ON_ANALYZING' && (
                <Database schema={demand.schema.schema} />
            )}
            {demand.status === 'ON_VERIFICATION' && (
                <Database
                    schema={demand.schema.schema}
                    suggests={demand.suggests}
                    onSelect={setPlan}
                />
            )}
        </main>
    );
};
