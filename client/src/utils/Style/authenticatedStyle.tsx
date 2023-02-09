import styled from 'styled-components';
import { colors } from './colors';

export const PageWrapper = styled.div`
    display: flex;
    flex-direction: row;

    width: 100%;
    height: 100%;

    background-color: ${colors.backgroundLight};
`;

export const SidebarWrapper = styled.div`
    height: 100vh;
`;

export const SidebarHeight = styled.div`
    height: 80%;
`;

export const RestWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 97%;
    background-color: ${colors.backgroundLight};
    width: 100%;
`;

export const FooterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: space-between;

    width: 100%;
    height: 100vh;

    background-color: ${colors.backgroundLight};
`;
