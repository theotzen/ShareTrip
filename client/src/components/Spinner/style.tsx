import styled, { keyframes } from 'styled-components';

export const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
    border: 10px solid #f3f3f3;
    border-top: 10px solid #3498db;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation-name: ${rotation};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
`;
