import React, { lazy, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Pagination } from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { ProjectHeader } from "./style";
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
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
const List = lazy(() => import("./overview/List"));

function Project({ match }) {
  const dispatch = useDispatch();

  // Filters from Redux store
  const filters = useSelector(
    (store) => store?.reservations?.reservationsFilters
  );

  // Pagination meta from API response
  const meta = useSelector((state) => state?.reservations?.reservations?.meta);

  // Reservations data array
  const reservations = useSelector(
    (state) => state?.reservations?.reservations?.data
  );

  // Local state for pagination controls
  // Default page & pageSize from meta or fallback
  const [page, setPage] = useState(meta?.pagination?.page || 1);
  const [pageSize, setPageSize] = useState(meta?.pagination?.pageSize || 10);

  // Local states for UI controls
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [filterStatus, setFilterStatus] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [trashView, setTrashView] = useState(false);
  const [textFilter, setTextFilter] = useState("");
  const [dateSortBy, setDateSortBy] = useState("createdAt:desc");
  const [ping, setPing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");

  // Fetch reservations on mount and when page, pageSize, filters or ping changes
  useEffect(() => {
    dispatch(
      getReservations({
        page,
        pageSize,
        // Include additional filters or search params as needed
        ...filters,
      })
    );
  }, [dispatch, page, pageSize, filters, ping]);

  // Handle filter selection changes
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Toggle modal visibility
  const showModal = () => setVisible(true);
  const onCancel = () => setVisible(false);

  // Pagination handlers for Ant Design Pagination component
  const onPageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Réservations"
          subTitle={<>{meta?.pagination?.total || 0} Réservations</>}
          buttons={[
            // <button
            //   key="trash-toggle"
            //   className="btn_ADD"
            //   onClick={() => setTrashView((prev) => !prev)}
            // >
            //   {trashView ? (
            //     <FeatherIcon icon="list" size={16} />
            //   ) : (
            //     <FeatherIcon icon="trash-2" size={16} />
            //   )}
            //   {trashView ? "Liste des réservations" : "Corbeille"}
            // </button>,
            <ExportButtonPageHeader
              key="export"
              setShouldPrint={setShouldPrint}
              setShouldExportPdf={setShouldExportPdf}
              setShouldExportExcel={setShouldExportExcel}
            />,
            <CalendarButtonPageHeader
              key="calendar"
              type="primary"
              size="default"
              className="btn_ADD"
              date={setDateFilter}
            />,
            // <Button
            //   key="create"
            //   type="primary"
            //   size="default"
            //   className="btn_ADD"
            //   onClick={showModal}
            // >
            //   <FeatherIcon icon="plus" size={16} /> Créer une nouvelle
            //   Réservation
            // </Button>,
          ]}
        />
      </ProjectHeader>

      <FilterBar>
        <ul>
          <Link to="#" onClick={() => handleFilterClick("")}>
            <li
              onClick={() => {
                dispatch(
                  setReservationsFilter({
                    ...filters,
                    commandStatus: {
                      in: [
                        "Pending",
                        "Canceled_by_partner",
                        "Canceled_by_client",
                      ],
                    },
                  })
                );
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
              En attente
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => {
              handleFilterClick("Canceled");
              dispatch(
                setReservationsFilter({
                  ...filters,
                  commandStatus: {
                    in: ["Canceled_by_partner", "Canceled_by_client"],
                  },
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
            <List
              textFilter={textFilter}
              filterStatus={filterStatus}
              dateFilter={dateFilter}
              dateSortBy={dateSortBy}
              shouldPrint={shouldPrint}
              setShouldPrint={setShouldPrint}
              shouldExportPdf={shouldExportPdf}
              setShouldExportPdf={setShouldExportPdf}
              shouldExportExcel={shouldExportExcel}
              setShouldExportExcel={setShouldExportExcel}
              setPing={setPing}
              ping={ping}
              trashView={trashView}
              reservations={reservations}
              filters={filters}
              onHandleChange={onPageChange}
              onShowSizeChange={onPageChange}
              page={page}
              pageSize={pageSize}
              total={meta?.pagination?.total}
            />
          </Col>
        </Row>

       

        {/* Create Reservation Modal
        {visible && (
          <CreateReservation
            onCancel={onCancel}
            visible={visible}
            setPing={setPing}
            ping={ping}
          />
        )} */}
      </Main>
    </>
  );
}

Project.propTypes = {
  match: propTypes.object,
};

export default Project;
