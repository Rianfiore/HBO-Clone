import styled from 'styled-components';

export const Modal = styled.div`
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: fixed;
  padding: 5%;

  border-radius: 25px;

  filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.1));
`;
