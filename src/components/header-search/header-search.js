import React, { useState } from "react";
// import { Input, Row, Col } from 'antd';
// import { NavLink } from 'react-router-dom';
// import FeatherIcon from 'feather-icons-react';
// import { useDispatch, useSelector } from 'react-redux';
import PropTypes from "prop-types";
// import { Div } from './header-search-style';
// import { headerSearchAction } from '../../redux/headerSearch/actionCreator';
// import { Popover } from '../popup/popup';
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import { useSelector } from "react-redux";

const HeaderSearch = ({ darkMode }) => {
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const path = window.location.pathname;

  const linkss = path.split("/")[2];
  return (
    <>
      <Div className="certain-category-search-wrapper" darkMode={darkMode}>
        {currentUser ? (
          <H1>
            {path === "/admin" && currentUser
              ? `Bienvenue, ${
                  currentUser?.name
                    ? currentUser?.name
                    : currentUser?.firstName
                    ? currentUser?.firstName
                    : "Pas de Nom"
                }`
              : "Dashboard"}
          </H1>
        ) : (
          "Dashboard"
        )}
        {linkss ? (
          <>
            <H1>
              <FontAwesome name="angle-right" size="2x" />
            </H1>
            <H1>{linkss.charAt(0).toUpperCase() + linkss.slice(1)}</H1>
          </>
        ) : null}
      </Div>
    </>
  );
};

HeaderSearch.propTypes = {
  darkMode: PropTypes.bool,
};

const Div = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  gap: 15px;
  /* border: 1px solid red; */
  width: 100%;
  /* height: 90%; */
  /* margin-left: 2.5rem; */
  padding-left: 10px;

  @media only screen and (max-width: 575px) {
    /* border: 2px solid yellow; */
    width: 100%;
  }
`;

const H1 = styled.h1`
  font-size: 1rem;
  display: flex;
  font-weight: 600;
  /* width: 100%; */
  height: 100%;
  text-align: center;
  color: ${(props) => (props.darkMode ? "#fff" : "#000")};

  @media only screen and (max-width: 575px) {
    /* border: 2px solid yellow; */
    /* width: 100%; */
    height: 100%;
    text-align: center;
    justify-content: flex-start;
    color: ${(props) => (props.darkMode ? "#red" : "fff")};
  }
`;

const DIV = styled.div`
  /* border: 1px solid black  ; */
`;

export default HeaderSearch;
