import React from "react";
import styled from "styled-components";

const Loader = () => {
  return <LineLoader></LineLoader>;
};

export default Loader;

export const LineLoader = styled.div`
  width: 100%;
  height: 3px;
  position: absolute;
  top: 0;
  overflow: hidden;
  background-color: #ddd;
  margin: -3px auto;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;

  &:before {
    content: "";
    position: absolute;
    left: -50%;
    height: 3px;
    width: 40%;
    background-color: gray;
    -webkit-animation: lineAnim 1s linear infinite;
    -moz-animation: lineAnim 1s linear infinite;
    animation: lineAnim 1s linear infinite;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
  }

  @keyframes lineAnim {
    0% {
      left: -40%;
    }
    50% {
      left: 20%;
      width: 80%;
    }
    100% {
      left: 100%;
      width: 100%;
    }
  }
`;
