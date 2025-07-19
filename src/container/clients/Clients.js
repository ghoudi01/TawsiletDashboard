import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "antd";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { ProjectHeader } from "./style";
import { Button } from "../../components/buttons/buttons";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import CreateUserModal from "./CreateUserModal";

const List = lazy(() => import("./overview/List"));

function Clients({ match }) {
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);

  const clientsCount = useSelector(
    (store) => store?.user?.clients?.pageInfo?.total
  );
  const { path } = match;
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  const [state, setState] = useState({
    visible: false,
  });
  const { visible } = state;
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
                  className="data_search_input"
                  placeholder="Rechercher ..."
                />
              </div>
              {clientsCount} Clients
            </div>
          }
          buttons={[
            <ExportButtonPageHeader
              key="2"
              setShouldPrint={setShouldPrint}
              setShouldExportPdf={setShouldExportPdf}
              setShouldExportExcel={setShouldExportExcel}
            />,
            [ "owner","agent_support"].includes(userRole)&& (
              <Button
                key="1"
                type="primary"
                size="default"
                className="btn_ADD"
                onClick={() => showModal(true)}
              >
                <FeatherIcon icon="plus" size={16} /> Ajouter un nouveau client
              </Button>
            ),
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
        <CreateUserModal onCancel={onCancel} visible={visible} />
      </Main>
    </>
  );
}

Clients.propTypes = {
  match: propTypes.object,
};

export default Clients;
