

import React from "react";

import styled from "styled-components";
// import * as style from "../../constants/StyleSheets";

export const Buttonobtenez = ({ Textbody, icon ,onCliclk}) => {
  
  return (
    <Button404 >
      <onCliclk />
      <Icon src={icon} />
      <Text>{Textbody}</Text>
    </Button404>
  );
};

export default Buttonobtenez;

const Text = styled.div`
  
  color: #020111;
  font-weight: 600;
  font-size: 14px;
  /* line-height: 155.56%; */
  display: flex;
  align-items: center;
  text-align: center;
  @media (max-width: 744px) {
    font-size: 10px;
    letter-spacing: 1px;
  }
`;
const Icon = styled.img`
  width: 20px !important;
  height: 20px !important;
  margin-left: 5px;
  transition: transform 0.4s ease;
  object-fit: contain;
  
`;

const Button404 = styled.button`
 
  /* font-weight: 700; */

  font-size: 16px;
  color: #020111;
  background-color: #dbb961;
  border: none;
  width:75%;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 8px;
  border-radius: 12px;

  /* width: 316px; */
  /* height: 55.14px; */
  padding: 15px 45px;
  @media (max-width: 744px) {
    padding: 8px 45px;
    margin: 10px !important;
  }

  &:hover {
    background-color: #18365a;
    border: 1px solid #dbb961;
    color: #dbb961;
  }

 
  .icon-arrow {
    width: 20px;
    height: 20px;
    margin-left: 5px;
    transition: transform 0.4s ease;
  }

  &:hover ${Text} {
    /* transition: transform 0.4s ease;
    transform: translateX(-40px); */
    filter: brightness(0) saturate(100%) invert(75%) sepia(73%) saturate(1494%)
      hue-rotate(1deg) brightness(107%) contrast(103%);
  }
`;
