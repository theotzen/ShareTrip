import styled from 'styled-components';
import { colors } from '../../utils/Style/colors';

export const HomeLogo = styled.img`
    height: 40px;
`;

export const NavContainer = styled.nav`
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5%;
    background-color: ${colors.white};
`;

export const MiddleDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width: 40%;
`;
export const LeftDiv = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 100%;
    width: 20%;
`;

export const RightDiv = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    height: 100%;
    width: 20%;
`;
