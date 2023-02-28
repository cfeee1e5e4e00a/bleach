import useSWR from 'swr';
import { Demand } from '@/entities/demand';
import { getDemandById } from '@/api/demands';
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
    const { data: apiData } = useSWR(id ? ['demands', id] : null, ([url, id]) =>
        getDemandById(id)
    );

    const realtimeData = useDemandByIdSubscribe(id);

    return {
        demand: mergeDataSources(apiData, realtimeData),
    };
};
