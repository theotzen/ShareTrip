import styled from 'styled-components';
import { colors } from '../../utils/Style/colors';

export const chat = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    margin-bottom: 0px;

    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;

    background-color: ${colors.backgroundLight};
`;


export const chat_old = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`
export const chat__sidebar = styled.div`
  height: 100%;
  background-color: ${colors.backgroundLight};
  width: 15%;
  padding-left: 20px;
`
export const chat__main = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 85%;
  background-color: ${colors.backgroundLight};
  align-items: center;
  justify-content: center;
`
export const chat__header = styled.h4`
  margin: 30px 0 20px 0;
`
export const chat__users = styled.div`
  margin-bottom: 0px;
  color: #607EAA;
  font-size: 14px;
`
export const online__users = styled.div`
  margin-bottom: 10px;
  color: rgb(238, 102, 102);
  font-style: italic;
`
export const chat__mainHeader = styled.header`
  width: 95%;
  height: 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  background-color: ${colors.backgroundLight};
`
export const leaveChat__btn = styled.button`
  padding: 10px;
  width: 10%;
  margin-right: 15px;
  border-radius: 6px;
  border: none;
  outline: none;
  background-color: #D1512D;
  cursor: pointer;
  color: #EAE3D2;
`
export const message__container = styled.div`
    width: 95%;
    height: 85%;
    background-color: white;
    border-radius: 6px;
    padding: 0px;
    overflow-y: scroll;
    margin-bottom: 0px;
    border: solid 1px #9a41e8 ;
`

export const chat__footer = styled.div`
  padding: 0px;
  background-color: ${colors.backgroundLight};
  width: 95%;
  height: 9%;
`
export const chat__form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const message = styled.input`
  width: 70%;
  height: 70%;
  border-radius: 6px;
  background-color: white;
  outline: none;
  padding: 0px;
  text-indent: 10px;
  border: solid 1px #9a41e8;
`
export const sendBtn = styled.button`
  width: 10%;
  background-color: #9a41e8;
  border-radius: 6px;
  padding: 10px;
  margin-right: 15px;
  border: none;
  outline: none;
  color: #EAE3D2;
  cursor: pointer;

  &:hover {
    background-color: #c393ed;
  }
`

export const message__recipient = styled.div`
    background-color: ${colors.backgroundLight};
    width: fit-content;
    max-width: 40%;
    padding: 10px;
    padding-right: 10px;
    border-radius: 10px;
    margin-right: auto;
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 15px;
    color: black;
`
export const message__sender= styled.div`
    background-color: #9a41e8;
    width: fit-content;
    max-width: 40%;
    padding: 10px;
    padding-left: 10px;
    border-radius: 10px;
    margin-left: auto;
    margin-right: 10px;
    margin-bottom: 5px;
    font-size: 15px;
    color: #FFF;
`
export const message__chats = styled.div`
  font-size: 13px;
`
export const sender__name = styled.div`
  text-align: right;
  margin-right: 15px;
  font-size: 0.9vh;
`

export const sender__name_for_recipient = styled.div`
  text-align: left;
  margin-left: 15px;
  font-size: 0.9vh;
`

export const message__status = styled.div`
  text-align: right;
  font-size: 10px;
  font-style: italic;
  margin-right: 15px;
`