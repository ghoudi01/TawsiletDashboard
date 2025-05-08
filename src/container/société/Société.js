import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import {
  getCompanies,
  updateUser,
} from "../../redux/User/userSlice";
import Sociétés from "./overview/ListSociété";
import Addsociété from "./Addsociété";
import FilterBar from "../../components/filtersBar/FilterBar";
import {
  getNotification,
  sendNotification,
} from "../../redux/notifications/notificationSlice";
import styled from "styled-components";

const ProjectHeader = styled.div`
  margin-bottom: 20px;
`;

const filterOptions = [
  { value: "", label: "Tous" },
  { value: "valid", label: "Valide" },
  { value: "invalid", label: "Invalide" },
  { value: "waiting", label: "En attente" },
];

// function checkDatesForExpiry(data, dispatch, currentId) {
//   const currentDate = new Date();

//   data?.forEach((entry) => {
//     const rcDate = new Date(entry.date_rc);
//     const licenseTransportDate = new Date(entry.date_licence_transport);

//     const daysUntilRCExpiry = Math.floor(
//       (rcDate - currentDate) / (24 * 60 * 60 * 1000)
//     );
//     const daysUntilLicenseExpiry = Math.floor(
//       (licenseTransportDate - currentDate) / (24 * 60 * 60 * 1000)
//     );

//     // const sendExpiryNotification = (type, daysUntilExpiry) => {
//     //   const notificationData = {
//     //     id: entry.company_id,
//     //     title: "Vous avez une notification.",
//     //     sendFrom: {
//     //       id: currentId?.id,
//     //       name: entry?.company_name,
//     //       expiredIn: daysUntilExpiry,
//     //       type,
//     //     },
//     //     notification_type: "expired",
//     //     types: ["notification", "email"],
//     //     smsCore: `votre ${type} expirera dans ${daysUntilExpiry} jours`,
//     //     notificationCore: "vous avez une notification",
//     //     saveNotification: true,
//     //     template_id: "d-8b266aac7fd64f73bab6ee0c80df8dbd",
//     //   };

//     //   dispatch(sendNotification(notificationData));

//     //   if (daysUntilExpiry <= 0) {
//     //     dispatch(
//     //       updateUser({
//     //         id: entry.company_id,
//     //         user: {
//     //           validation: {
//     //             validation_state: "invalid",
//     //             description: `${type} expiré`,
//     //           },
//     //         },
//     //       })
//     //     );
//     //   }
//     // };

//     if (daysUntilRCExpiry < 30) {
//       sendExpiryNotification("assurance rc pro", daysUntilRCExpiry);
//     }

//     if (daysUntilLicenseExpiry < 30) {
//       sendExpiryNotification("licence de transport", daysUntilLicenseExpiry);
//     }

//     dispatch(getNotification({ id: currentId?.id }));
//   });
// }

function Project({ match }) {
  const dispatch = useDispatch();
  const currentId = useSelector((state) => state?.user?.currentUser);
  const societe = useSelector((state) => state?.companies.companies);
  const societesCount = useSelector(
    (state) => state?.user?.companies?.pagination?.total
  );

  const [state, setState] = useState({
    notData: societe,
    visible: false,
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [dateData, setDateData] = useState(null);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (societe) {
      const newData = societe.map((el) => ({
        company_id: el?.id,
        company_name: el?.username,
        date_rc: el?.assurance_rc_pro_date,
        date_licence_transport: el?.licence_de_transport_date,
      }));
      setDateData(newData);
    }
  }, [societe]);

  const handleSearch = (searchText) => {
    const data = societe?.filter(
      (item) =>
        item?.nameOwner.toUpperCase().startsWith(searchText.toUpperCase()) ||
        item?.name.toUpperCase().startsWith(searchText.toUpperCase())
    );
    setState({
      ...state,
      notData: data,
    });
  };

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setFilterStatus(filter);
  };

  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Sociétés"
          subTitle={
            <div style={{ display: "flex", alignItems: "center" }}>
              <>{societesCount} Sociétés partenaires</>
            </div>
          }
        />
      </ProjectHeader>
      
      <FilterBar
        setFilterStatus={setFilterStatus}
        setTextFilter={setTextFilter}
      >
        <ul>
          {filterOptions.map((option) => (
            <Link 
              to="#" 
              key={option.value}
              onClick={() => handleFilterClick(option.value)}
            >
              <li
                className={
                  activeFilter === option.value ? "slected_filter_status_bg" : ""
                }
              >
                {option.label}
              </li>
            </Link>
          ))}
        </ul>
      </FilterBar>

      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <Sociétés
              text={textFilter}
              handleSearch={handleSearch}
              textFilter={textFilter}
              filterStatus={filterStatus}
            />
            <Addsociété onCancel={onCancel} visible={state.visible} />
          </Col>
        </Row>
      </Main>
    </>
  );
}

Project.propTypes = {
  match: propTypes.object,
};

export default Project;