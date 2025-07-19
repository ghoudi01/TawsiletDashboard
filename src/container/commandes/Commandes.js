import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Modal } from "antd";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
// import CreateProject from "./overview/CreateProject";
import { ProjectHeader } from "./style";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import {
  getCommands,
  setCommandsFilter,
  setFilter,
} from "../../redux/reservations/reservationSlice";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
import FilterBar from "./utils/filtersBar/FilterBar";

const List = lazy(() => import("./overview/List"));

function Commandes({ match }) {
  const dispatch = useDispatch();
  const filters = useSelector((store) => store?.reservations?.commandsFilters);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  useEffect(() => {
    dispatch(
      getCommands({
        Pagination: { page: 1, pageSize: 10 },
        filters,
        currentUser
      })
    );
  }, [dispatch, filters]);

  const commands = useSelector((state) => state?.reservations?.commands?.data);
 
  const meta = useSelector((state) => state?.reservations?.commands?.meta?.pagination);
  // const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  const [dateSortBy, setDateSortBy] = useState("createdAt:desc");
  const [activeFilter, setActiveFilter] = useState("");
  // const searchData = useSelector((state) => state.headerSearchData);
  const [createModal, setCreateModal] = useState(false);

  const [state, setState] = useState({
    data: commands,
    current: 1,
    pageSize: 10,
  });
  
 

  const onHandlePageChange = async (pagination) => {
    
    try {
      await dispatch(
        //on change Pagination Number
        getCommands({
          Pagination: {
            page: pagination.current,
            pageSize: pagination.pageSize,
          },
          filters,
          currentUser
        })
      );

      setState((prevState) => ({
        ...prevState,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }));
    } catch (err) {
      throw err;
    }
  };

 

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Commandes"
          buttons={[
            <ExportButtonPageHeader
              key="2"
              setShouldPrint={setShouldPrint}
              setShouldExportPdf={setShouldExportPdf}
              setShouldExportExcel={setShouldExportExcel}
            />,
            <CalendarButtonPageHeader key="1" date={setDateFilter} />,
          ]}
        />
      </ProjectHeader>
      <FilterBar
     
      >
        <ul>
          <Link to="#" onClick={() => handleFilterClick("")}>
            {" "}
            <li
              onClick={() => {
                const updatedFilters = { ...filters };
                delete updatedFilters["commandStatus"];
                dispatch(setCommandsFilter(updatedFilters));
              }}
              className={
                !filters?.commandStatus ? "slected_filter_status_bg" : ""
              }
            >
              Tous
            </li>{" "}
          </Link>
          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Dispatching");
              dispatch(
                setCommandsFilter({
                  ...filters,
                  commandStatus: { eq: "Dispatched_to_partner" },
                })
              );
            }}
          >
            {" "}
            <li
              className={
                activeFilter === "Dispatching" ? "slected_filter_status_bg" : ""
              }
            >
              En attente
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Assigned");
              dispatch(
                setCommandsFilter({
                  ...filters,
                  commandStatus: {
                    in: [
                      "Assigned_to_driver",
                      "Driver_on_route_to_pickup",
                      "Arrived_at_pickup",
                      "Picked_up",
                      "On_route_to_delivery",
                      "Arrived_at_delivery",
                      "Delivered",
                    ],
                  },
                })
              );
            }}
          >
            {" "}
            <li
              className={
                activeFilter === "Assigned" ? "slected_filter_status_bg" : ""
              }
            >
              En cours
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Canceled");
              dispatch(
                setCommandsFilter({
                  ...filters,
                  commandStatus: {
                    in: [
                      "Canceled_by_client",
                      "Failed_pickup",
                      "Failed_delivery",
                    ],
                  },
                })
              );
            }}
          >
            {" "}
            <li
              className={
                activeFilter === "Canceled" ? "slected_filter_status_bg" : ""
              }
            >
              Annulés
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Completed");
              dispatch(
                setCommandsFilter({
                  ...filters,
                  commandStatus: { eq: "Completed" },
                })
              );
            }}
          >
            <li
              className={
                activeFilter === "Completed" ? "slected_filter_status_bg" : ""
              }
            >
              Terminés
            </li>
          </Link>
        </ul>
      </FilterBar>
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <List
                // textFilter={textFilter}
                // filterStatus={filterStatus}
                dateFilter={dateFilter}
                dateSortBy={dateSortBy}
                shouldPrint={shouldPrint}
                setShouldPrint={setShouldPrint}
                setShouldExportPdf={setShouldExportPdf}
                shouldExportPdf={shouldExportPdf}
                setShouldExportExcel={setShouldExportExcel}
                shouldExportExcel={shouldExportExcel}
                reservations={commands}
                meta={meta}
                onHandlePageChange={onHandlePageChange}
              />
            </div>
          </Col>
        </Row>

        <Modal open={createModal} onCancel={() => setCreateModal(false)} />
      </Main>
    </>
  );
}

Commandes.propTypes = {
  match: propTypes.object,
};

export default Commandes;
