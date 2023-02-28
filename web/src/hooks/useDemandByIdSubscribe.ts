import { useState, useEffect } from 'react';
import { Demand } from '@/entities/demand';
import { baseURL } from '@/api';

export const useDemandByIdSubscribe = (id?: number | string) => {
    const [realtimeData, setRealtimeData] = useState<Demand>();

    useEffect(() => {
        if (id === undefined) {
            return;
        }

        const sse = new EventSource(`${baseURL}/api/v1/demands/${id}/events`);

        const onMessage = (event: MessageEvent<string>) => {
            setRealtimeData(JSON.parse(event.data));
        };

        const onOpen = () => {
            sse.addEventListener('message', onMessage);
        };

        sse.addEventListener('open', onOpen);

        return () => {
            sse.removeEventListener('open', onOpen);
            sse.removeEventListener('message', onMessage);
        };
    }, [id]);

    return realtimeData;
};
