import React, { useState } from "react";
import styled from "styled-components";
import { Input, Skeleton } from "antd";
import ReloadIcon from "../../static/img/icon/reload.svg";
import DragIcon from "../../static/img/icon/drag.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import DriverItem from "./DriverItem";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 18,
    }}
    spin
  />
);
const { Search } = Input;

const colors = {
  vert: "green",
  rouge: "red",
  gris: "gray",
};

const DriverList = ({
  selectedDriver,
  setSelectedDriver,
  driversList,
  setCenterSelected,
  setZoomSelected,
  setPing,
  ping,
  filterText,
  setFilterText,
}) => {
 
  const onSearch = (e) => setFilterText(e.target.value);
  const isLoading = useSelector((store) => store.user.isLoading);
  const [asideActive, setAsideActive] = useState(true);
  return (
    <DriverListParent>
      <OpenClose onClick={() => setAsideActive(!asideActive)}>
        <img src={DragIcon} alt="drag" />
      </OpenClose>
      <DriverListContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: asideActive ? "space-between" : "center",
            paddingRight: asideActive ? 10 : 0,
          }}
        >
          {asideActive ? (
            <Search
              placeholder="Nom , Télephone , ..."
              allowClear
              size="small"
              style={{
                padding: 4,
                width: "92%",
              }}
              onChange={onSearch}
            />
          ) : null}
          <ReloadContainer
            asideactive={asideActive}
            onClick={() => setPing(!ping)}
          >
            {isLoading ? (
              <Spin className="reload-icon" indicator={antIcon} />
            ) : (
              <img src={ReloadIcon} alt="reload" className="reload-icon" />
            )}
          </ReloadContainer>
        </div>
        <div className="divWithScrollbar">
        {driversList.map((driver, i) => (
                  <DriverItem
                    key={i}
                    driver={driver}
                    setCenterSelected={setCenterSelected}
                    setSelectedDriver={setSelectedDriver}
                    setZoomSelected={setZoomSelected}
                    asideActive={asideActive}
                  />
                ))}
        </div>
      </DriverListContainer>
    </DriverListParent>
  );
};

export default DriverList;

const DriverListParent = styled.div`
  position: relative;
  height: calc(100vh - 125px);
`;

const DriverListContainer = styled.div`
  * {
    margin: 0%;
    padding: 0;
    box-sizing: border-box;
  }
  z-index: 9999;
  background-color: rgba(250, 250, 250, 1);
  position: relative;
  max-width: 350px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* === */
  height: 100%;
  overflow-y: scroll;
  .ant-input-affix-wrapper {
    height: 30px;
    padding-inline: 5px;
  }

  .reload-icon {
    width: 18px;
    height: 18px;
    /* transform: rotate(-45deg); */
  }

  /* width */
  ::-webkit-scrollbar {
    width: 3px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const DriverCard = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid
    ${(props) => (props.disablecard ? "rgba(200,200,200,1)" : "none")};
  border-radius: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  &:hover {
    box-shadow: 0px 5px 5px rgba(57, 71, 81, 0.18);
  }
  h1 {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    color: ${(props) => (props.disablecard ? "black" : "gray")};
  }

  img {
    width: 40px;
    height: 40px !important;
    object-fit: cover;
    object-position: top;
    border-radius: 50%;
    border: 1px solid rgba(200, 200, 200, 0.5);
  }
`;

const Bulle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.driverstatus};
`;

const OpenClose = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 40vh;
  right: -25px;
  background-color: white;
  z-index: 99;
  padding: 4px;
  border-radius: 10px;
  transform: rotate(45deg);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    transform: rotate(-45deg);
  }
`;

const ReloadContainer = styled.div`
  cursor: pointer;
  padding: ${(props) => (props.asideactive ? "4px" : "8px")};
  border: 1px solid rgba(200, 200, 200, 0.9);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.asideactive ? "80%" : "100%")};
  width: ${(props) => (props.asideactive ? "unset" : "100%")};
`;
