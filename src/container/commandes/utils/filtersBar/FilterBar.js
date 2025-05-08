import React from "react";
import "./FilterBar.css";
import { Select } from "antd";
import { Option } from "antd/lib/mentions";
import { useDispatch, useSelector } from "react-redux";
import { setCommandsFilter } from "../../../../redux/reservations/reservationSlice";
const FilterBar = ({
  children,
  setDateSortBy,
  withSort = false,
}) => {
  const filters = useSelector(store => store?.reservations?.commandsFilters)
  const dispatch= useDispatch()
  return (
    <div className="filter_bar_container">
      <div className="filter_search_status">
        <div className="project-sort-nav">
          <nav>{children}</nav>
        </div>
        <div className="project-sort-search">
          <input
            className="data_search_input"
            type="text"
            onChange={(e) => {
              dispatch(setCommandsFilter({...filters,pickUpAddress:{Address:{containsi:e.target.value}}}))
              // setTextFilter(e.target.value)
            }}
            placeholder="Recherche ..."
            patterns
          />
        </div>
      </div>
      {withSort && (
        <div className="filter_sort_list">
          <Select
            placeholder="Trier par ..."
            className="reservation_select_sort_date"
            onChange={(e) => setDateSortBy(e)}
          >
            <Option value={"departDate:asc"}>Date de départ ascendant</Option>
            <Option value={"departDate:desc"}>Date de départ descendant</Option>
            <Option value={"createdAt:asc"}>Date de création ascendant</Option>
            <Option value={"createdAt:desc"}>
              Date de création descendant
            </Option>
          </Select>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
