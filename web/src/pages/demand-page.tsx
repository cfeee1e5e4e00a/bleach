import { FC } from 'react';
import { useParams } from 'react-router-dom';

export const DemandPage: FC = () => {
    const { id } = useParams();

    return (
        <main className="flex flex-col items-start justify-center flex-grow">
            <h1 className="text-3xl">Экспортирую базу данных</h1>
        </main>
    );
};
