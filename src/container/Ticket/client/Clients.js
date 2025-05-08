import React, { lazy, useState, Suspense, useEffect } from "react";
import { ProjectHeader, ProjectSorting } from "./style";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { ExportButtonPageHeader } from "../../../components/buttons/export-button/export-button";
import { Button } from "../../../components/buttons/buttons";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import { Main } from "../../styled";
import { Row, Col, Spin, Select } from "antd";
import CreateUserModal from "../../clients/CreateUserModal";
import propTypes from "prop-types";
import CreateTicketModal from "./CreateTicketModal";
const List = lazy(() => import("./overview/List"));
function ClientsTicket({ match }) {
   const ticketsCount = useSelector(
     (store) => store?.tickets?.tickets?.meta?.pagination?.total
   );
    const { path } = match;
     const [shouldPrint, setShouldPrint] = useState(false);
     const [shouldExportPdf, setShouldExportPdf] = useState(false);
     const [shouldExportExcel, setShouldExportExcel] = useState(false);
     //------------------------------ modal add user ------------------------------------------------------------------
   
     const [state, setState] = useState({
       visible: false,
     });
     const { notData, visible } = state;
     const showModal = (x) => {
       setState({
         ...state,
         visible: x,
       });
     };
   
     const onCancel = () => {
       setState({
         ...state,
         visible: false,
       });
     };
   
     //----------------------------------------------------------------------------------------------------------------
     const [text, settext] = useState("");
  return (
   <>
   <ProjectHeader>
   <PageHeader
     ghost
     title="Clients"
     subTitle={
       <div style={{ display: "flex", alignItems: "center" }}>
         <div
           className="project-sort-search"
           style={{ marginRight: "1vw" }}
         >
           <input
             onChange={(e) => settext(e.target.value)}
             // dataSource={notData}
             className="data_search_input"
             placeholder="Rechercher ..."
             patterns
           />
         </div>
         <>{ticketsCount} Tickets </>{" "}
       </div>
     }
     buttons={[
       <ExportButtonPageHeader
         key="2"
         setShouldPrint={setShouldPrint}
         setShouldExportPdf={setShouldExportPdf}
         setShouldExportExcel={setShouldExportExcel}
       />,
      //  <Button
      //    key="1"
      //    type="primary"
      //    size="default"
      //    className="btn_ADD"
      //    onClick={() => showModal(true)}
      //  >
      //    <FeatherIcon icon="plus" size={16} /> Ajouter un nouveau problème
      //  </Button>,
     ]}
   />
 </ProjectHeader>
 <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <List
                text={text}
                shouldPrint={shouldPrint}
                setShouldPrint={setShouldPrint}
                setShouldExportPdf={setShouldExportPdf}
                shouldExportPdf={shouldExportPdf}
                setShouldExportExcel={setShouldExportExcel}
                shouldExportExcel={shouldExportExcel}
              />
            </div>
          </Col>
        </Row>
        <CreateTicketModal onCancel={onCancel} visible={visible} />
      </Main>
 </>
  );
}
ClientsTicket.propTypes = {
  match: propTypes.object,
};


export default ClientsTicket;