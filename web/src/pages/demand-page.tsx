import { Database } from '@/containers/database';
import { useDemandById } from '@/hooks/useDemandById';
import { displayDemandStatus } from '@/utils/display-demand-status';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

export const DemandPage: FC = () => {
    const { id } = useParams();

    const { demand } = useDemandById(id);

    if (!demand) {
        return (
            <main className="flex items-center justify-center md:p-12 flex-grow w-full">
                <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl"></div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center flex-grow w-full md:p-12 gap-8">
            <h1 className="text-3xl">
                Заявка #{id} {displayDemandStatus(demand.status)}
            </h1>
            <Database
                demand={{
                    id: 228,
                    status: 'ON_VERIFICATION',
                    uri: 'postgresql://postgres:root@217.71.129.139:4070/demo?scheme=bookings',
                    schema: {
                        name: {
                            column_name: 'name',
                            example_data: [
                                'Максим',
                                'Саша',
                                'Леша',
                                'Максим',
                                'Саша',
                                'Леша',
                            ],
                            is_nullable: false,
                            human_type: 'text',
                            type: 'text',
                        },
                        email: {
                            column_name: 'email',
                            example_data: [
                                'nerlihmax@ya.ru',
                                'anarcom@gmail.com',
                                'uchansansan@g.nsu.ru',
                                'nerlihmax@ya.ru',
                                'anarcom@gmail.com',
                                'uchansansan@g.nsu.ru',
                            ],
                            is_nullable: false,
                            human_type: 'text',
                            type: 'text',
                        },
                    },
                    suggests: {},
                }}
            />
        </main>
    );
};
