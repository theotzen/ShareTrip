import styled from 'styled-components';
import { colors } from '../../utils/Style/colors';

export const FooterDiv = styled.div`
    background-color: ${colors.backgroundLight};
    left: 0;
    width: 100%;
    display: flex;

    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1vh;

    margin-top: auto;
    margin: 0px 0px;

    height: 3%;
`;

export const FooterSpan = styled.span`
    color: ${colors.backgroundDark};
    font-weight: normal;
    white-space: normal;
    vertical-align: bottom;
    margin-top: 3px;
`;
