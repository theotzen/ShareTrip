import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserManager from './utils/context/UserContext';
import SocketContextComponent from './utils/context/SocketContextComponent'

import Authenticated from './Authenticated';
import Spinner from './components/Spinner';
import useUser from './hooks/useUser';
import Login from './pages/Login';

function App() {
    const { user, isLoading, error } = useUser();

    if (isLoading) {
        return <Spinner />;
    }

    if (!user || error) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <UserManager user={user.user}>
            <SocketContextComponent>
                <Authenticated />
            </SocketContextComponent>
        </UserManager>
    );
}

export default App;
