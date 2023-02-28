import { useState, useEffect } from 'react';
import { Demand } from '@/entities/demand';
import { baseURL } from '@/api';

export const useAllDemandsSubscribe = () => {
    const [realtimeData, setRealtimeData] = useState<Demand>();

    useEffect(() => {
        const sse = new EventSource(`${baseURL}/api/v1/demands/events`);

        const onMessage = (event: MessageEvent<string>) => {
            console.log('received onAllDemands', event.data);
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
    }, []);

    return realtimeData;
};
