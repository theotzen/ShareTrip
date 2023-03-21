import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import GlobalStyle from './utils/Style/globalStyles';

import * as styles from './utils/Style/authenticatedStyle';

import Error from './pages/Error';
import Home from './pages/Home';
import Chat from './pages/Chat'

const Aboutus = React.lazy(() => import('./pages/Aboutus'));

export default function Authenticated() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <React.Suspense fallback={<Spinner />}>
                <styles.FooterWrapper>
                    <Navbar />
                    <styles.PageWrapper>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/aboutus" element={<Aboutus />} />
                            <Route path="/chat/:roomId" element={<Chat />} />
                            <Route path="*" element={<Error />} />
                        </Routes>
                    </styles.PageWrapper>
                    <Footer />
                </styles.FooterWrapper>
            </React.Suspense>
        </BrowserRouter>
    );
}
