import React from "react";
import "./FilterBar.css";
import { useDispatch, useSelector } from "react-redux";
import { setDriversFilter } from "../../../../redux/User/userSlice";

const FilterBar = ({ children }) => {
  const filters = useSelector(store => store?.user?.driversFilters);
  const dispatch = useDispatch();

  return (
    <div className="filter_bar_container">
      <div className="filter_search_status">
        <div className="project-sort-nav">
          <nav>{children}</nav>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 