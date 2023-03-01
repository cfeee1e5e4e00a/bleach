import useSWR from 'swr';
import { Demand } from '@/entities/demand';
import { getDemandById, submitDemandVerification } from '@/api/demands';
import { useDemandByIdSubscribe } from '@/hooks/useDemandByIdSubscribe';

const mergeDataSources = (
    apiData: Demand | undefined,
    realtimeData: Demand | undefined
) => {
    if (!realtimeData) {
        return apiData;
    } else {
        return realtimeData;
    }
};

export const useDemandById = (id?: number | string) => {
    const { data: apiData, mutate } = useSWR(
        id ? ['demands', id] : null,
        ([url, id]) => getDemandById(id)
    );

    let realtimeData = useDemandByIdSubscribe(id);

    const submitVerification = async (
        dto: Parameters<typeof submitDemandVerification>[1]
    ) => {
        if (!id) return;
        const updated = await submitDemandVerification(id, dto);
        realtimeData = undefined;
        await mutate(updated);
        return updated;
    };

    return {
        demand: mergeDataSources(apiData, realtimeData),
        submitVerification,
    };
};
