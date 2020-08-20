import styled from 'styled-components/macro';
import theme from './theme';
const { fontSizes } = theme;

const Button1 = styled.button`
  background-color: green;
  font-size: ${fontSizes.base};
  cursor: pointer;
  border: 0;
  border-radius: 30px;
  transition: ${theme.transition};
  &:focus,
  &:active {
    outline: 0;
  }
`;

export default Button1;