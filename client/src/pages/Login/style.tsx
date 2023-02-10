import styled from 'styled-components';
import { colors } from '../../utils/Style/colors';

export const FullBody = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: start;

    width: 100%;
    height: 100vh;
`;

export const HalfBodyLeft = styled.div`
    display: flex;
    flex: 1;
    background-color: ${colors.backgroundDark};
`;

export const HalfBodyCenter = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: start;
    background-color: ${colors.backgroundDark};
`;

export const HalfBodyRight = styled.div`
    display: flex;
    flex: 1;
    background-color: ${colors.backgroundDark};
`;

export const Rectangle = styled.div`
    width: 64px;
    height: 6px;
    left: 0px;
    top: 0px;
    background: linear-gradient(
        90deg,
        ${colors.primary} -6.98%,
        ${colors.primary} 103.25%
    );
    border-radius: 137px;
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 40px 0px 10px 0px;
`;

export const FormTitle = styled.span`
    font-size: 40px;
    font-weight: blod;
    color: ${colors.primary};
    margin-bottom: 15px;
`;

export const FormBox = styled.span`
    box-sizing: border-box;
    width: 100%;
    height: auto;

    /* Auto layout */
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 30px;

    /* Design and colors */
    border: 1px solid ${colors.primary};
    border-radius: 20px;
    background-color: ${colors.primary};
`;

export const FormGlobal = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormInput = styled.input`
    /* Auto layout */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 5px 20px;
    width: 90%;

    /* Design and colors */
    background: ${colors.backgroundDark};
    border: 0px;
    border-radius: 45px;
    color: ${colors.primary};

    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
    margin: 5px 0px;

    ::placeholder {
        color: ${colors.primary};
        opacity: 0.5;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px ${colors.backgroundDark} inset !important;
    }

    &:-webkit-autofill {
        -webkit-text-fill-color: ${colors.primary} !important;
    }
`;

export const FormSubmit = styled.input`
    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px 24px;
    border: 0px;
    width: 30%;

    /* Design and colors */
    background: ${colors.backgroundDark};
    border-radius: 27px;
    color: ${colors.primary};

    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px;

    transition: 200ms ease-in;
    &:hover {
        box-shadow: 0px 0px 4px ${colors.backgroundDark};
        cursor: pointer;
    }
`;

export const Category = styled.div`
    font-size: 14px;
    font-weight: blod;
    color: ${colors.dark};
    margin: 0px 0px 20px 0px;
    width: 100%;
`;

export const CategoryTitle = styled.span`
    font-size: 14px;
    font-weight: bold;
    color: ${colors.dark};
`;

export const NavText = styled.nav`
    font-weight: normal;
    color: ${colors.primary};
    gap: 5px;
`;

export const ErrorMessage = styled.span`
    font-size: 12px;
    color: red;
    text-align: left;
    padding: 10px;
`;

export const ButtonSwitch = styled.button`
    color: ${colors.primary};
    text-decoration: underline;
    background-color: ${colors.backgroundDark};
    border-radius: none;
    border: none;
    &:hover {
        box-shadow: 0px 0px 4px ${colors.primary};
        cursor: pointer;
    }
`;

export const HomeLogo = styled.img`
    height: 15%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
`;
