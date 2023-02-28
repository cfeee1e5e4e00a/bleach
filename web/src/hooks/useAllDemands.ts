import useSWR from 'swr';
import { createDemand, getAllDemands } from '@/api/demands';
import { Demand } from '@/entities/demand';
import { useAllDemandsSubscribe } from '@/hooks/useAllDemandsSubscribe';

const mergeDataSources = (
    fromApi: Demand[] | undefined,
    fromSSE: Demand | undefined
) => {
    if (!fromApi) {
        return fromApi;
    }

    if (!fromSSE) {
        return fromApi;
    }

    const idx = fromApi.findIndex(({ id }) => fromSSE.id === id);

    if (idx === -1) {
        return fromApi.concat(fromSSE);
    } else {
        fromApi[idx] = fromSSE;
        return fromApi;
    }
};

export const useAllDemands = () => {
    const { data: apiData, mutate } = useSWR('demands', getAllDemands);

    const create = async (dto: Parameters<typeof createDemand>[0]) => {
        const created = await createDemand(dto);
        await mutate([...(apiData ?? []), created]);
        return created;
    };

    const realtimeData = useAllDemandsSubscribe();

    return {
        create,
        demands: mergeDataSources(apiData, realtimeData),
    };
};
