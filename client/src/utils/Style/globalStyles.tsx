import styled, { createGlobalStyle } from 'styled-components';
import { colors } from './colors';

const GlobalStyle = createGlobalStyle`
	* {		
		font-family: 'Avenir', Helvetica, sans-serif;
	}

  	body {
		margin: 0px;
		padding: 0px;
		background: ${colors.backgroundLight};
		overflow-y: auto;
		min-height: 100vh!important;
		min-width: 100%;
	}
`;

export default GlobalStyle;

export const PrecButton = styled.button`
    background-color: #aeb3c0;
    border: 1px solid #9da2af;
    border-radius: 4px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: Graphik, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    font-size: 14px;

    text-align: center;
    text-transform: none;
    transition: all 80ms ease-in-out;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;

    width: 100px;
    height: 30px;

    &:disabled {
        opacity: 0.5;
    }

    .button-26:focus {
        outline: 0;
    }

    &:hover {
        background-color: #797e89;
        border-color: #717784;
    }

    &:active {
        background-color: #797e89;
        border-color: #717784;
    }
`;

export const SuivButton = styled.button`
    background-color: #1652f0;
    border: 1px solid #1652f0;
    border-radius: 4px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: Graphik, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    font-size: 14px;

    text-align: center;
    text-transform: none;
    transition: all 80ms ease-in-out;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;

    width: 100px;
    height: 30px;

    &:disabled {
        opacity: 0.5;
    }

    .button-26:focus {
        outline: 0;
    }

    &:hover {
        background-color: #0a46e4;
        border-color: #0a46e4;
    }

    &:active {
        background-color: #0039d7;
        border-color: #0039d7;
    }
`;

export const CreateButton = styled.button`
    background-color: #26873b;
    border: 1px solid #1d6d2e;
    border-radius: 4px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: Graphik, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    font-size: 14px;

    text-align: center;
    text-transform: none;
    transition: all 80ms ease-in-out;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;

    width: fit-content;
    height: 30px;

    &:disabled {
        opacity: 0.5;
    }

    .button-26:focus {
        outline: 0;
    }

    &:hover {
        background-color: #1d672d;
        border-color: #155d25;
    }

    &:active {
        background-color: #1d672d;
        border-color: #155d25;
    }
`;
