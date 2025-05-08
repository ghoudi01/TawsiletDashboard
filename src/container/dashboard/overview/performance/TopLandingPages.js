import React, { useState, useEffect, useCallback } from "react";
import { Skeleton, Table } from "antd";
import { NavLink, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { LadingPages } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import { getBalance } from "../../../../redux/chartContent/chartSlice";

// Static content for the "more" dropdown
const moreContent = (
  <>
    <NavLink to="#">
      <FeatherIcon size={16} icon="printer" />
      <span>Printer</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="book-open" />
      <span>PDF</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="file-text" />
      <span>Google Sheets</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="x" />
      <span>Excel (XLSX)</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="file" />
      <span>CSV</span>
    </NavLink>
  </>
);

function TopLandingPages({ setperiodeFilter, settaille, setsharedData, periodeFilter }) {
  const [landingFilter, setLandingFilter] = useState(periodeFilter); // Simplified state for filter
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { data: balanceData, loading, error } = useSelector((state) => state.balance);

  // Fetch balance data when the landing filter changes
  useEffect(() => {
    dispatch(getBalance({ periodeFilter: landingFilter })).then((res) => {
      if (res.payload?.companies && Array.isArray(res.payload.companies)) {
        const sharedData = res.payload.companies.find((el) => el?.companyId?.id === selectedCompanyId);
        setsharedData(sharedData || null);
      }
    });
    setperiodeFilter(landingFilter);
  }, [landingFilter, dispatch, selectedCompanyId, setsharedData, setperiodeFilter]);

  // Handle filter change
  const handleFilterChange = useCallback((value) => {
    setLandingFilter(value);
  }, []);

  // Handle row click to set selected company
  const handleRowClick = useCallback((company) => {
    settaille(12);
    setsharedData(company);
    setSelectedCompanyId(company?.companyId?.id);
  }, [settaille, setsharedData]);

  // Table columns
  const landingColumns = [
    {
      title: "Nom de l'entreprise",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nbr Commandes",
      dataIndex: "nbrTotal",
      key: "nbrTotal",
    },
    {
      title: "Prix Totale",
      dataIndex: "priceTotal",
      key: "priceTotal",
    },
    {
      title: "En ligne",
      dataIndex: "nbrCredit",
      key: "nbrCredit",
    },
    {
      title: "Prix en ligne",
      dataIndex: "totalCredit",
      key: "totalCredit",
    },
    {
      title: "Livraison",
      dataIndex: "nbrLivraison",
      key: "nbrLivraison",
    },
    {
      title: "Prix a la livraison",
      dataIndex: "totalLivraison",
      key: "totalLivraison",
    },
  ];

  // Table data
  const landingData = balanceData?.companies?.map((company) => ({
    key: company?.companyId?.id,
    name: (
      <Link to="#" className="page-title" onClick={() => handleRowClick(company)}>
        {company?.companyId?.name}
      </Link>
    ),
    nbrTotal: (
      <span style={{ cursor: "pointer", width: "100%" }} onClick={() => handleRowClick(company)}>
        {company?.commandes?.filter(Boolean).length}
      </span>
    ),
    priceTotal: (
      <span style={{ cursor: "pointer", width: "100%", whiteSpace: "nowrap" }} onClick={() => handleRowClick(company)}>
        {`${company?.details?.totalbalance.toFixed(2)} TND`}
      </span>
    ),
    nbrCredit: (
      <span style={{ cursor: "pointer", width: "100%" }} onClick={() => handleRowClick(company)}>
        {company?.details?.nbrCredit}
      </span>
    ),
    totalCredit: (
      <span style={{ cursor: "pointer", width: "100%", whiteSpace: "nowrap" }} onClick={() => handleRowClick(company)}>
        {`${company?.details?.totalCredit.toFixed(2)} TND`}
      </span>
    ),
    totalLivraison: (
      <span style={{ cursor: "pointer", width: "100%", whiteSpace: "nowrap" }} onClick={() => handleRowClick(company)}>
        {`${company?.details?.totalLivraison.toFixed(2)} TND`}
      </span>
    ),
    nbrLivraison: (
      <span style={{ cursor: "pointer", width: "100%" }} onClick={() => handleRowClick(company)}>
        {company?.details?.nbrLivraison}
      </span>
    ),
  }));

  return (
    <div className="full-width-table">
      <Cards
        isbutton={
          <div className="card-nav">
            <ul>
              {["today", "week", "month", "year", "all"].map((filter) => (
                <li key={filter} className={landingFilter === filter ? "active" : "deactivate"}>
                  <Link onClick={() => handleFilterChange(filter)} to="#">
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
        }
        title="Activiter des sociétés"
        size="large"
      >
        <LadingPages>
          <div className="table-bordered table-responsive">
            {loading ? (
              <Skeleton active />
            ) : error ? (
              <p>Error: {error.message || "Failed to fetch data."}</p>
            ) : (
              <Table
                columns={landingColumns}
                dataSource={landingData}
                pagination={false}
                size="small"
              />
            )}
          </div>
        </LadingPages>
      </Cards>
    </div>
  );
}

export default TopLandingPages;