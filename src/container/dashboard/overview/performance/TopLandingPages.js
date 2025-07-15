import React, { useState, useEffect, useCallback } from "react";
import { Skeleton, Table, Select, Input } from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { LadingPages } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import { getBalance } from "../../../../redux/chartContent/chartSlice";

const { Option } = Select;
 

function TopLandingPages({  setsharedData,sharedData }) {
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [sortOption, setSortOption] = useState("commission_desc"); // e.g. commission_desc, commission_asc, lastTransaction_desc, lastTransaction_asc
  const [filterText, setFilterText] = useState("");

  const dispatch = useDispatch();
  const { data: balanceData, loading, error } = useSelector((state) => state.balance);

  useEffect(() => {

    if(sharedData==null)
    dispatch(getBalance({ filterText, sortOption })).then((res) => {
      if (res.payload?.drivers && Array.isArray(res.payload.drivers)) {
        setDrivers(res.payload.drivers);
      }
    });
  }, [dispatch, selectedDriverId,  filterText, sortOption,sharedData]);

 

  const handleRowClick = (driver) => {
   
    setsharedData(driver);
    setSelectedDriverId(driver?.driver?.id);
  } 

  // Filtering and sorting logic
  // Remove getFilteredSortedDrivers, use drivers directly

  const driverColumns = [
    {
      title: "Nom du livreur",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nbr Commandes",
      dataIndex: "nbrTotal",
      key: "nbrTotal",
    },
    {
      title: "Prix Brut",
      dataIndex: "revenusDesVentes",
      key: "revenusDesVentes",
    },
    {
      title: "Prix Net",
      dataIndex: "beneficeNet",
      key: "beneficeNet",
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
    },
    {
      title: "Débit Total",
      dataIndex: "debitTotal",
      key: "debitTotal",
    },
  ];

  const driverData = drivers?.map((driver) => ({
    key: driver?.driverId?.id,
    name: (
      <Link to="#" className="page-title" onClick={() => handleRowClick(driver)}>
        {driver?.driverId?.firstName + " " + driver?.driverId?.lastName}
      </Link>
    ),
    nbrTotal: (
      <span style={{ cursor: "pointer", width: "100%" }} onClick={() => handleRowClick(driver)}>
        {driver?.details?.nbrLivraison}
      </span>
    ),
    revenusDesVentes: (
      <span style={{ cursor: "pointer", width: "100%", whiteSpace: "nowrap" }} onClick={() => handleRowClick(driver)}>
        {`${driver?.details?.revenusDesVentes?.toFixed(2)} TND`}
      </span>
    ),
    beneficeNet: (
      <span style={{ cursor: "pointer", width: "100%" }} onClick={() => handleRowClick(driver)}>
        {driver?.details?.beneficeNet?.toFixed(2) + " TND"}
      </span>
    ),
    commission: (
      <span style={{ cursor: "pointer", width: "100%", whiteSpace: "nowrap" }} onClick={() => handleRowClick(driver)}>
        {(driver?.details?.revenusDesVentes - driver?.details?.beneficeNet).toFixed(2) + " TND"}
      </span>
    ),
    debitTotal: (
      driver?.details?.debitTotal !== undefined && driver?.details?.debitTotal !== null ? (
        <span style={{ cursor: "pointer", width: "100%" }} onClick={() => handleRowClick(driver)}>
          {driver?.details?.debitTotal.toFixed(2) + " TND"}
        </span>
      ) : (
        <span style={{ color: '#bbb' }}>-</span>
      )
    ),
    children:
      driver?.subDrivers?.length > 0
        ? driver.subDrivers.map((subDriver) => ({
            key: `${subDriver?.driver?.id}`,
            name: subDriver?.driver?.firstName + " " + subDriver?.driver?.lastName,
            nbrTotal: subDriver?.nbrTotal || 0,
            revenusDesVentes: `${(subDriver?.revenusDesVentes || 0).toFixed(2)} TND`,
            beneficeNet: `${(subDriver?.beneficeNet || 0).toFixed(2)}%`,
            commission: `${(subDriver?.rejectionRate || 0).toFixed(2)}%`,
          }))
        : null,
  }));

  // UI for sort and filter
  const sortAndFilterUI = (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Select
        value={sortOption}
        style={{ width: 260 }}
        onChange={setSortOption}
        placeholder="Trier par"
      >
        <Option value="commission_asc">Commission Ascendant</Option>
        <Option value="commission_desc">Commission Descendant</Option>
        <Option value="lastTransaction_asc">Dernière Transaction Ascendant</Option>
        <Option value="lastTransaction_desc">Dernière Transaction Descendant</Option>
      </Select>
      <Input
        style={{ width: 200 }}
        placeholder="Filtrer par nom..."
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        allowClear
      />
    </div>
  );

  return (
    <div className="full-width-table">
      <Cards
        isbutton={sortAndFilterUI}
        title="Activité des livreurs"
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
                columns={driverColumns}
                dataSource={driverData}
                pagination={false}
                size="small"
                expandable={{
                  defaultExpandAllRows: false,
                  expandRowByClick: true,
                }}
              />
            )}
          </div>
        </LadingPages>
      </Cards>
    </div>
  );
}

export default TopLandingPages;