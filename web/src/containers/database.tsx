import { DemanOnVerification } from '@/entities/demand';
import { type FC } from 'react';

type Props = {
    demand: DemanOnVerification;
};

export const Database: FC<Props> = ({ demand }) => {
    return (
        <div className="w-full h-full flex flex-row">
            <nav className="bg-slate-50 rounded-l-xl border border-gray-200 border-r-0">
                <h2 className="text-xl font-medium px-6 py-3">Таблицы</h2>
                <ul className="w-full flex flex-col items-start divide-y divide-gray-200 border-b border-t border-gray-200">
                    <li className="px-6 py-3 w-full cursor-pointer">table 1</li>
                    <li className="px-6 py-3 w-full cursor-pointer">table 1</li>
                    <li className="px-6 py-3 w-full cursor-pointer">table 1</li>
                </ul>
            </nav>
            <div className="flex flex-col w-full">
                <table className="table-auto h-fit w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            {Object.values(demand.schema).map(
                                ({ column_name, type }) => (
                                    <th
                                        className="border px-4 py-3 bg-slate-50 border-gray-200"
                                        key={column_name}
                                    >
                                        <span className="text-xl font-medium">
                                            {column_name}
                                        </span>
                                        <span className="text-base text-gray-400 font-normal">
                                            {` - ${type}`}
                                        </span>
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(demand.schema)[0].example_data.map(
                            (_, columnIdx) => (
                                <tr
                                    className="even:bg-slate-50"
                                    key={`col-${columnIdx}`}
                                >
                                    {Object.values(demand.schema).map(
                                        (column, rowIdx) => (
                                            <td
                                                className="border px-4 py-2 border-gray-200"
                                                key={`row-${rowIdx}`}
                                            >
                                                {column.example_data[columnIdx]}
                                            </td>
                                        )
                                    )}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                <div className="flex-grow border-gray-200 border border-t-0 w-full bg-slate-50"></div>
            </div>
        </div>
    );
};
