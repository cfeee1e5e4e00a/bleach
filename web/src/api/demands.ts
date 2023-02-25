import { CreateDemandDto, Demand } from '@/entities/demand';
import { api } from '.';

export const getAllDemands = async (): Promise<Demand[]> => {
    const { data } = await api.get<Demand[]>('demands');
    return data;
};

export const getDemandById = async (id: number | string): Promise<Demand> => {
    const { data } = await api.get<Demand>(`demands/${id}`);
    return data;
};

export const createDemand = async (dto: CreateDemandDto): Promise<Demand> => {
    const { data } = await api.post<Demand>('demands', dto);
    return data;
};
