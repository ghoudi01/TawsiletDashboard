import React, { useState } from "react";
import { Progress, Statistic, Row, Col, Card, Button as AntButton, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import { OverviewCard } from "../../style";
import AddHistorique from "../../Finance/AddHistorique";
import Heading from "../../../../components/heading/heading";
import { Button } from "../../../../components/buttons/buttons";

function DailyOverview({ sharedData, settaille ,setsharedData}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { rtl } = useSelector((state) => ({
    rtl: state.ChangeLayoutMode.rtlData,
  }));
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);


  // Early return if sharedData or sharedData.details is missing
  if (!sharedData || !sharedData.details) {
    return <p>Aucune donnée disponible.</p>;
  }

  const { details = {}, driverId = {} } = sharedData;
  const {
    revenusDesVentes = 0,
    beneficeNet = 0,
    debitTotal = null,
    nbrLivraison = 0,
    totalLivraison = 0,
    totalbalance = 1,
    nbrCredit = 0,
    totalCredit = 0,
    drivers = [],
  } = details;
  const { name = "", firstName = "", lastName = "", id: driverIdValue } = driverId;

  const netBalance =( revenusDesVentes - beneficeNet)+debitTotal;

  const handleSettle = () => setIsModalVisible(true);

  // Table columns for sub drivers
  const subDriverColumns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Revenus des Ventes (TND)",
      dataIndex: "revenusDesVentes",
      key: "revenusDesVentes",
      render: (value) => value?.toFixed(2),
    },
    {
      title: "Bénéfice Net (TND)",
      dataIndex: "beneficeNet",
      key: "beneficeNet",
      render: (value) => value?.toFixed(2),
    },
  ];

  return (
    <OverviewCard color={(netBalance <= 0).toString()}>
      <AddHistorique
        visible={isModalVisible}
        onCancel={() => {setIsModalVisible(false);setsharedData(null)}}
        defaultAmount={Math.abs(netBalance)}
        defaultDriverId={driverIdValue}
      />
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Heading as="h4">{name || `${firstName} ${lastName}`}</Heading>
        </Col>
        <Col>
          <Button onClick={() => setsharedData(null)} type="danger" shape="circle" style={{ padding: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FeatherIcon icon="x" size={18} />
          </Button>
        </Col>
      </Row>

      {/* Revenus des Ventes Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ background: "#f6ffed" }}>
            <Statistic
              title={<span style={{ color: "#389e0d" }}>Revenus des Ventes</span>}
              value={revenusDesVentes}
              precision={2}
              suffix="TND"
              valueStyle={{ color: "#389e0d", fontWeight: 600, fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ background: "#fffbe6" }}>
            <Statistic
              title={<span style={{ color: "#d48806" }}>Bénéfice Net</span>}
              value={beneficeNet}
              precision={2}
              suffix="TND"
              valueStyle={{ color: "#d48806", fontWeight: 600, fontSize: 28 }}
            />
          </Card>
        </Col>
        {debitTotal !== null && debitTotal !== undefined && (
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: "#fff1f0" }}>
              <Statistic
                title={<span style={{ color: "#cf1322" }}>Débit Total</span>}
                value={debitTotal}
                precision={2}
                suffix="TND"
                valueStyle={{ color: "#cf1322", fontWeight: 600, fontSize: 28 }}
              />
            </Card>
          </Col>
        )}
      </Row>
      <Card bordered={false} style={{ background: netBalance <= 0 ? "#e6fffb" : "#fff1f0", marginBottom: 20 }}>
        <Statistic
          title={
            netBalance <= 0 ? (
              <span style={{ color: "#08979c" }}>À verser au livreur</span>
            ) : (
              <span style={{ color: "#cf1322" }}>À recevoir du livreur</span>
            )
          }
          value={Math.abs(netBalance)}
          precision={2}
          suffix="TND"
          valueStyle={{ color: netBalance <= 0 ? "#08979c" : "#cf1322", fontWeight: 600, fontSize: 28 }}
        />
        {userRole=="owner"&& Math.round(netBalance) !== 0 && (
          <AntButton
            type={netBalance <= 0 ? "primary" : "default"}
            style={{ marginTop: 12, color: netBalance <= 0 ? "#08979c" : "#cf1322", borderColor: netBalance <= 0 ? "#08979c" : "#cf1322" }}
            onClick={handleSettle}
            ghost={netBalance > 0}
          >
            Régler
          </AntButton>
        )}
      </Card>

      {/* Sub Drivers Table Section */}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Liste des Sous-Livreurs</h3>
        <Table
          columns={subDriverColumns}
          dataSource={drivers}
          rowKey={(record, idx) => record.name + idx}
          pagination={false}
        />
      </Card>
    </OverviewCard>
  );
}

export default DailyOverview;