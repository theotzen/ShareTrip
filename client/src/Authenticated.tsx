import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import GlobalStyle from './utils/Style/globalStyles';
import io, { Socket } from "socket.io-client";

import * as styles from './utils/Style/authenticatedStyle';

import Error from './pages/Error';
import Home from './pages/Home';
import Chat from './pages/Chat'
import { UserContext } from './utils/context';

const Aboutus = React.lazy(() => import('./pages/Aboutus'));

let socket: Socket;

export default function Authenticated() {

    const user = React.useContext(UserContext)

    React.useEffect(() => {
        socket = io('http://localhost:9000')

        socket.emit('newUser', {userId: user.user!.id, socketId: socket.id})

        return () => {
            socket.close()
          }
    }, [])

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
                            <Route path="/chat/:roomId" element={<Chat socket={ socket }/>} />
                            <Route path="*" element={<Error />} />
                        </Routes>
                    </styles.PageWrapper>
                    <Footer />
                </styles.FooterWrapper>
            </React.Suspense>
        </BrowserRouter>
    );
}
