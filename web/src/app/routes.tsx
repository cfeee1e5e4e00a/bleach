import { MainLayout } from '@/layouts/main-layout';
import { CreateDemandPage } from '@/pages/create-demand-page';
import { DemandPage } from '@/pages/demand-page';
import { HomePage } from '@/pages/home-page';
import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'demand/:id',
                element: <DemandPage />,
            },
            {
                path: 'create-demand',
                element: <CreateDemandPage />,
            },
        ],
    },
];
