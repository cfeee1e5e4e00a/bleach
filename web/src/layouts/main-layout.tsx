import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import '@/styles/fade-transition.css';

export const MainLayout = () => {
    const { key } = useLocation();
    const outlet = useOutlet();

    return (
        <TransitionGroup className="w-full h-full">
            <CSSTransition classNames="fade" key={key} timeout={300}>
                <div className="w-full h-full flex flex-col items-center">
                    <header className="w-full flex flex-row md:px-12 py-6 items-center justify-center text-3xl border-b border-gray-200">
                        Bleach
                    </header>
                    {outlet}
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};
