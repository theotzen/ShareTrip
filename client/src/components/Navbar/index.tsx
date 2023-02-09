import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import { UserContext } from '../../utils/context';
import { PrecButton } from '../../utils/Style/globalStyles';
import * as styles from './style';

export default function Navbar() {
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();

    const logoutUser = () => {
        axios
            .get('api/auth/logout')
            .then(() => {
                mutate('/api/users/me', null);
                navigate('/login');
            })
            .catch(() => {
                navigate('/error');
            });
    };

    return (
        <styles.NavContainer>
            <styles.LeftDiv>
                <Link to="/">
                    <button type="button">Logo</button>
                </Link>
            </styles.LeftDiv>
            <styles.MiddleDiv>
                <Link to="/demo">Page 1</Link>
                <Link to="/aboutus">Page 2</Link>
                <Link to="/aboutus">Page 3</Link>
                <Link to="/aboutus">Page 4</Link>
            </styles.MiddleDiv>
            <styles.RightDiv>
                <PrecButton type="button" onClick={logoutUser}>
                    Déconnexion
                </PrecButton>
            </styles.RightDiv>
        </styles.NavContainer>
    );
}
