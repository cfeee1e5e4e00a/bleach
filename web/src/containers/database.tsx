import {
    AnonymizingMethod,
    anonymizingMethods,
    DatabaseSchema,
    DatabaseSuggest,
    MigrationPlan,
} from '@/entities/demand';
import { useState, type FC } from 'react';

type Props = {
    schema: DatabaseSchema;
    suggests?: DatabaseSuggest[];
    onSelect?: (selectedMethod: MigrationPlan) => void;
};

export const Database: FC<Props> = ({ schema, suggests, onSelect }) => {
    const [currentTable, setCurrentTable] = useState(Object.keys(schema)[0]);
    const [plan, setPlan] = useState(() => {
        const plan: Record<
            string,
            Record<string, AnonymizingMethod>
        > = Object.keys(schema).reduce((acc, table) => {
            const columns: Record<string, AnonymizingMethod> = schema[
                table
            ].reduce((acc, { column_name }) => {
                const suggest = suggests?.find(
                    (s) => s.column === column_name && s.table === table
                );
                return {
                    ...acc,
                    [column_name]: suggest?.method ?? 'skip',
                };
            }, {});
            return { ...acc, [table]: columns };
        }, {});

        if (onSelect) {
            onSelect(plan);
        }

        return plan;
    });

    return (
        <div className="w-full h-full flex flex-row">
            <nav className="bg-white rounded-l-xl border border-gray-200">
                <h2 className="bg-slate-50 text-xl font-medium px-6 py-3 rounded-l-xl">
                    Таблицы
                </h2>
                <ul className="w-full flex flex-col items-start divide-y divide-gray-200 border-t border-gray-200">
                    {Object.keys(schema).map((table) => (
                        <li
                            className={`px-6 py-3 w-full cursor-pointer ${
                                table === currentTable ? 'bg-slate-50' : ''
                            }`}
                            onClick={() => setCurrentTable(table)}
                            key={table}
                        >
                            {table}
                        </li>
                    ))}
                </ul>
            </nav>
            <table className="table-auto h-fit block overflow-auto whitespace-nowrap border-collapse">
                <thead>
                    <tr>
                        {schema[currentTable].map(({ column_name, type }) => (
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
                        ))}
                    </tr>
                    {suggests !== undefined && (
                        <tr>
                            {Object.entries(plan[currentTable]).map(
                                ([column, method]) => {
                                    return (
                                        <th
                                            className="border px-4 py-3 border-gray-200"
                                            key={`${currentTable}-${column}`}
                                        >
                                            <select
                                                value={method}
                                                onChange={(event) => {
                                                    setPlan((prev) => {
                                                        prev[currentTable][
                                                            column
                                                        ] = event.target
                                                            .value as AnonymizingMethod;

                                                        const curr = {
                                                            ...prev,
                                                        };

                                                        if (onSelect) {
                                                            onSelect(curr);
                                                        }

                                                        return curr;
                                                    });
                                                }}
                                            >
                                                {anonymizingMethods.map(
                                                    (method) => (
                                                        <option
                                                            value={method}
                                                            key={method}
                                                        >
                                                            {method}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </th>
                                    );
                                }
                            )}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {schema[currentTable][0].example_data.map(
                        (_, columnIdx) => (
                            <tr
                                className="even:bg-slate-50"
                                key={
                                    schema[currentTable][columnIdx].column_name
                                }
                            >
                                {schema[currentTable].map((column, rowIdx) => (
                                    <td
                                        className="px-4 py-2 border border-gray-200"
                                        key={`${rowIdx}-${column.example_data[columnIdx]}`}
                                    >
                                        {column.example_data[columnIdx]}
                                    </td>
                                ))}
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};
