import styled from "styled-components";
import colors from "../../../styles/colors";

const Wrapper = styled.div`
  border: ${colors.Gray2} 1px solid;
  border-radius: 4px;
  position: absolute;
  right: 6px;
  top: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 4px;
  background-color: ${colors.White};
  &:hover {
    cursor: pointer;
  }
`;

export { Wrapper };
