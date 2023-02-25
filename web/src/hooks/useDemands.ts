import useSWR from 'swr';
import { createDemand, getAllDemands, getDemandById } from '@/api/demands';

type UseDemandsArgs = {
    id?: number;
    all?: true;
};

export const useDemands = (args: UseDemandsArgs = {}) => {
    const { data: all, mutate: mutateAll } = useSWR(
        args?.all ? 'demands' : null,
        getAllDemands
    );

    const { data: byId } = useSWR(
        args?.id ? ['demands', args.id] : null,
        ([url, id]) => getDemandById(id)
    );

    const create = async (dto: Parameters<typeof createDemand>[0]) => {
        const created = await createDemand(dto);
        await mutateAll([...(all ?? []), created]);
        return created;
    };

    return {
        create,
        all,
        byId,
    };
};
