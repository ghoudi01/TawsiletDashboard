import React from "react";
import { NavLink } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Popover } from "../../popup/popup";
import { Button } from "../buttons";

const ExportButtonPageHeader = ({
  setShouldPrint,
  setShouldExportPdf,
  setShouldExportExcel,
}) => {
  const content = (
    <>
      <NavLink to="#" onClick={() => setShouldPrint(true)}>
        <FeatherIcon size={16} icon="printer" />
        <span>Imprimante</span>
      </NavLink>
      <NavLink to="#" onClick={() => setShouldExportPdf(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      {/*    <NavLink to="#">
        <FeatherIcon size={16} icon="file-text" />
        <span>Google Sheets</span>
      </NavLink> */}
      <NavLink to="#" onClick={() => setShouldExportExcel(true)}>
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      {/* <NavLink to="#">
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink> */}
    </>
  );
  return (
    <Popover placement="bottomLeft" content={content} trigger="click">
      <Button size="small" className="btn_ADD">
        <FeatherIcon icon="download" size={14} />
        Exporter
      </Button>
    </Popover>
  );
};

export { ExportButtonPageHeader };
