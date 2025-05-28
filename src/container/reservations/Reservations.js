import React, { lazy, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Pagination } from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { ProjectHeader, ProjectSorting } from "./style";
import { Button } from "../../components/buttons/buttons";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import {
  getReservations,
  setReservationsFilter,
} from "../../redux/reservations/reservationSlice";

import CreateReservation from "./overview/CreateReservation";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import FilterBar from "../../components/filtersBar/FilterBar";
import { getCompanies, getusers } from "../../redux/User/userSlice";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
const List = lazy(() => import("./overview/List"));

function Project({ match }) {
  const dispatch = useDispatch();
  const filters = useSelector(
    (store) => store?.reservations?.reservationsFilters
  );

  useEffect(() => {
    dispatch(
      getReservations({
        Pagination: { page: 1, pageSize: 10 },
        filters,
      })
    );
  }, [dispatch, filters]);

  const reservations = useSelector(
    (state) => state?.reservations?.reservations?.nodes
  );
  console.log("🚀 ~ Project ~ reservations:", reservations);
  
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const meta = useSelector(
    (state) => state?.reservations?.reservations?.pageInfo
  );
  const [filterStatus, setFilterStatus] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  // const { path } = match;

  const [state, setState] = useState({
    visible: false,
  });
  const { notData, visible } = state;
  useEffect(() => {
    if (visible) {
      dispatch(getCompanies());
    }
  }, [visible]);

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
  const [trashView, settrashView] = useState(false);
  const [textFilter, setTextFilter] = useState("");
  const [dateSortBy, setDateSortBy] = useState("createdAt:desc");
  const [ping, setPing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };
  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Réservations"
          subTitle={<>{meta?.total} Reservations</>}
          buttons={[
            <button
              className="btn_ADD"
              onClick={() =>
                trashView ? settrashView(false) : settrashView(true)
              }
            >
              {trashView ? (
                <FeatherIcon icon="list" size={16} />
              ) : (
                <FeatherIcon icon="trash-2" size={16} />
              )}
              {trashView ? "liste des réservations" : "Corbeille"}
            </button>,
            <ExportButtonPageHeader
              key="2"
              setShouldPrint={setShouldPrint}
              setShouldExportPdf={setShouldExportPdf}
              setShouldExportExcel={setShouldExportExcel}
            />,
            <CalendarButtonPageHeader
              type="primary"
              size="default"
              className="btn_ADD"
              key="1"
              date={setDateFilter}
            />,

            // <Button
            //   key="1"
            //   type="primary"
            //   size="default"
            //   className="btn_ADD"
            //   onClick={() => showModal(true)}
            // >
            //   <FeatherIcon icon="plus" size={16} /> Créer une nouvelle
            //   Réservation
            // </Button>,
          ]}
        />
      </ProjectHeader>

      <FilterBar
      // setFilterStatus={setFilterStatus}
      // setTextFilter={setTextFilter}
      // setDateSortBy={setDateSortBy}
      // withSort={true}
      >
        <ul>
          <Link to="#" onClick={() => handleFilterClick("")}>
            <li
              onClick={() => {
                // const updatedFilters = { ...filters };
                // delete updatedFilters["commandStatus"];
                dispatch(setReservationsFilter({
                  ...filters,
                  commandStatus: { in: ["Pending", "Canceled_by_partner", "Canceled_by_client"] },
                }));
              }}
              className={activeFilter === "" ? "slected_filter_status_bg" : ""}
            >
              Tous
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Pending");
              dispatch(
                setReservationsFilter({
                  ...filters,
                  commandStatus: { eq: "Pending" },
                })
              );
            }}
          >
            <li
              className={
                activeFilter === "Pending" ? "slected_filter_status_bg" : ""
              }
            >
              En attend
            </li>
          </Link>

          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Canceled");
              dispatch(
                setReservationsFilter({
                  ...filters,
                  commandStatus: { in: ["Canceled_by_partner", "Canceled_by_client"] },
                })
              );
            }}
          >
            <li
              className={
                activeFilter === "Canceled" ? "slected_filter_status_bg" : ""
              }
            >
              Annulés
            </li>
          </Link>
        </ul>
      </FilterBar>

      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <List
                textFilter={textFilter}
                filterStatus={filterStatus}
                dateFilter={dateFilter}
                dateSortBy={dateSortBy}
                shouldPrint={shouldPrint}
                setShouldPrint={setShouldPrint}
                setShouldExportPdf={setShouldExportPdf}
                shouldExportPdf={shouldExportPdf}
                setShouldExportExcel={setShouldExportExcel}
                shouldExportExcel={shouldExportExcel}
                setPing={setPing}
                ping={ping}
                trashView={trashView}
                reservations={reservations}
                filters={filters}
              />
            </div>
          </Col>
        </Row>
        {visible ? (
          <>
            {" "}
            <CreateReservation
              onCancel={onCancel}
              visible={visible}
              setPing={setPing}
              ping={ping}
            />
          </>
        ) : null}
      </Main>
    </>
  );
}

Project.propTypes = {
  match: propTypes.object,
};

export default Project;
