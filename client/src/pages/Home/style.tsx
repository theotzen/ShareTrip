import styled from 'styled-components';
import { colors } from '../../utils/Style/colors';

export const Wrapper = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background-color: ${colors.backgroundLight};
`;
