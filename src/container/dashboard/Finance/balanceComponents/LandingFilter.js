import React from "react";
import { Link } from "react-router-dom";

function LandingFilter({ landingFilter, onFilterChange }) {
  const filters = ["today", "week", "month", "year", "all"];

  return (
    <div className="card-nav">
      <ul>
        {filters.map((filter) => (
          <li key={filter} className={landingFilter === filter ? "active" : "deactivate"}>
            <Link onClick={() => onFilterChange(filter)} to="#">
              {filter === "today" && "Aujourd'hui"}
              {filter === "week" && "Semaine"}
              {filter === "month" && "Mois"}
              {filter === "year" && "Année"}
              {filter === "all" && "Tous"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingFilter;
