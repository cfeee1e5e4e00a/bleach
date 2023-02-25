import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CreateDemandDto,
    createDemandDtoSchema,
    DatabaseBrand,
} from '@/entities/demand';
import { stringUnionToArray } from '@/utils/string-union-to-array';
import { useDemands } from '@/hooks/useDemands';

const databaseBrands = stringUnionToArray<DatabaseBrand>()('postgresql');

export const CreateDemandPage: FC = () => {
    const navigate = useNavigate();

    const { create } = useDemands();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateDemandDto>({
        resolver: zodResolver(createDemandDtoSchema),
    });

    const onSubmit: SubmitHandler<CreateDemandDto> = async (data) => {
        const { id } = await create(data);
        navigate(`/demand/${id}`);
    };

    return (
        <main className="flex flex-col items-center justify-center flex-grow w-full">
            <form
                className="flex flex-col items-start gap-8 justify-center w-max"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className="text-3xl">Создание заявки</h1>
                <div className="flex flex-col gap-2">
                    <p>База данных</p>
                    <select
                        className="border border-gray-200 rounded-md px-4 py-2"
                        {...register('database')}
                    >
                        {databaseBrands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <p>URI</p>
                    <input
                        className="border md:w-96 border-gray-200 rounded-md px-4 py-2"
                        {...register('uri')}
                        placeholder="postgresql://user:password@host:port/database?scheme=scheme"
                    ></input>
                    <p className="text-red-500">{errors.uri?.message}</p>
                </div>

                <button className="px-8 py-2 border border-gray-200 rounded-md transition duration-75 hover:scale-95 hover:bg-green-500 hover:text-white">
                    Создать
                </button>
            </form>
        </main>
    );
};
