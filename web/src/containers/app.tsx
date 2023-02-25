import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from '@/containers/router';

import '@/index.css';

export const App: FC = () => {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
};
