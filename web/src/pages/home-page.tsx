import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useDemands } from '@/hooks/useDemands';
import { displayDemandStatus } from '@/utils/display-demand-status';

export const HomePage = () => {
    const navigate = useNavigate();

    const { all: demands } = useDemands({ all: true });

    return (
        <main className="flex flex-col gap-8 items-center md:py-10 md:px-24 w-full flex-grow">
            <h1 className="text-3xl">Заявки</h1>
            <ul className="flex flex-col gap-4 md:w-96">
                <li
                    className="w-full p-4 flex flex-row justify-center gap-2 items-center border border-gray-200 bg-green-500 rounded-md cursor-pointer hover:scale-95 hover:bg-gray-50 transition duration-75 text-white"
                    onClick={() => navigate(`/create-demand`)}
                >
                    <span>Создать заявку</span>
                    <PlusIcon className="w-6 h-6" />
                </li>
                {!demands
                    ? Array.from({ length: 5 }).map((_, idx) => (
                          <li
                              className="h-[58px] rounded-lg bg-slate-200 animate-pulse"
                              key={idx}
                          ></li>
                      ))
                    : demands.map(({ id, status }) => (
                          <li
                              className="w-full p-4 flex flex-row justify-between items-center border border-gray-200 rounded-md cursor-pointer hover:scale-95 hover:bg-gray-50 transition duration-75"
                              key={id}
                              onClick={() => navigate(`/demand/${id}`)}
                          >
                              <span>#{id}</span>
                              <span>{displayDemandStatus(status)}</span>
                          </li>
                      ))}
            </ul>
        </main>
    );
};
