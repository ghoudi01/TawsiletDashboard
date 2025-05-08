import React, { useEffect, useState } from "react";
import { Progress, Modal, message } from "antd";
import FeatherIcon from "feather-icons-react";
import { useSelector, useDispatch } from "react-redux";
import { OverviewCard } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { Button } from "../../../../components/buttons/buttons";
import { addHistorique, getHistorique } from "../../../../redux/chartContent/chartSlice";

function DailyOverview({ periodeFilter, sharedData, settaille, commision }) {
  const dispatch = useDispatch();

  // Fetch historique data when periodeFilter or sharedData changes
  useEffect(() => {
    dispatch(getHistorique({ periodeFilter }));
  }, [periodeFilter, sharedData, dispatch]);

  const historique = useSelector((state) => state?.charts?.historique?.data);
  const { rtl } = useSelector((state) => ({
    rtl: state.ChangeLayoutMode.rtlData,
  }));

  const [totalH, settotalH] = useState(0);

  // Calculate totalH (net balance)
  useEffect(() => {
    if (historique && sharedData) {
      const payed = historique
        ?.filter((el) => el?.sender?.data?.id === sharedData?.companyId.id)
        .reduce((acc, obj) => acc + obj.sold, 0);
      const recieved = historique
        ?.filter((el) => el?.reciever?.data?.id === sharedData?.companyId.id)
        .reduce((acc, obj) => acc + obj.sold, 0);

      settotalH(payed - recieved);
    }
  }, [historique, sharedData]);

  // Handle settling the balance
  const handleSettle = (amount) => {
    Modal.confirm({
      title: "Confirmation D'action",
      content: "Êtes-vous sûr de vouloir régler ce montant ?",
      okText: "Oui",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        dispatch(
          addHistorique({
            data: {
              sender: amount > 0 ? 227 : sharedData?.companyId?.id,
              reciever: amount > 0 ? sharedData?.companyId?.id : 227,
              sold: Math.abs(amount),
              transactionType: amount > 0 ? "outcomes" : "incomes",
              payType: "virement",
            },
          })
        ).then(() => {
          message.success("Solde réglé avec succès !");
          dispatch(getHistorique({ periodeFilter })); // Refresh historique data
        });
      },
    });
  };

  if (!sharedData) {
    return <p>Aucune donnée disponible.</p>;
  }

  const netBalance =
    (sharedData?.details?.totalbalance * (100 - commision)) / 100 -
    sharedData?.details?.totalLivraison +
    totalH;

  return (
    <OverviewCard color={(netBalance >= 0).toString()}>
      <div className="d-flex align-items-center justify-content-between overview-head">
        <Heading as="h4">{sharedData?.companyId?.name}</Heading>
        <Button onClick={() => settaille(24)}>
          Retour
          <FeatherIcon icon="arrow-left" size={14} />
        </Button>
      </div>

      <div className="overview-box">
        <Cards headless>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {netBalance >= 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 20 }}>
                  Vous devez verser à{" "}
                  <span style={{ color: "green" }}>
                    {sharedData?.companyId?.name}
                  </span>
                </span>
                <h1 style={{ fontSize: 40, fontWeight: 600, color: "green" }}>
                  {` + ${netBalance.toFixed(2)} TND`}
                </h1>
                {Math.round(netBalance) === 0 ? null : (
                  <button
                    style={{ color: "green" }}
                    className="moneyBTN"
                    onClick={() => handleSettle(netBalance)}
                  >
                    Régler
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 20 }}>
                  <span style={{ color: "red" }}>
                    {sharedData?.companyId?.name}
                  </span>{" "}
                  doit vous verser
                </span>
                <h1 style={{ fontSize: 40, fontWeight: 600, color: "red" }}>
                  {` ${netBalance.toFixed(2)} TND`}
                </h1>
                {Math.round(netBalance) === 0 ? null : (
                  <button
                    style={{ color: "red" }}
                    className="moneyBTN"
                    onClick={() => handleSettle(netBalance)}
                  >
                    Régler
                  </button>
                )}
              </div>
            )}
          </div>
        </Cards>
      </div>

      <div className="overview-box">
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="overview-box-single">
              <Heading as="h2" className="color-primary">
                {sharedData?.details?.nbrLivraison}
              </Heading>
              <p>Commandes payées à la livraison</p>
            </div>
            <div className="overview-box-single text-right">
              <Heading as="h2">{`${sharedData?.details?.totalLivraison.toFixed(
                2
              )} TND`}</Heading>
              <p>Somme totale des livraisons</p>
            </div>
          </div>

          <Progress
            percent={(
              (sharedData?.details?.totalLivraison /
                sharedData?.details?.totalbalance) *
              100
            ).toFixed(2)}
            showInfo={false}
            className="progress-primary"
          />

          <p>
            <span className="growth-upward">
              <span>Pourcentage par rapport au revenu total</span>
            </span>
            <span
              className="overview-box-percentage"
              style={{ float: !rtl ? "right" : "left" }}
            >
              {`${(
                (sharedData?.details?.totalLivraison /
                  sharedData?.details?.totalbalance) *
                100
              ).toFixed(2)} %`}
            </span>
          </p>
        </Cards>
      </div>

      <div className="overview-box">
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="overview-box-single">
              <Heading as="h2" className="color-info">
                {sharedData?.details?.nbrCredit}
              </Heading>
              <p>Commandes payées en ligne</p>
            </div>
            <div className="overview-box-single text-right">
              <Heading as="h2">{`${sharedData?.details?.totalCredit.toFixed(
                2
              )} TND`}</Heading>
              <p>Somme totale en ligne</p>
            </div>
          </div>

          <Progress
            percent={(
              (sharedData?.details?.totalCredit /
                sharedData?.details?.totalbalance) *
              100
            ).toFixed(2)}
            showInfo={false}
          />

          <p>
            <span className="growth-upward">
              <span>Pourcentage par rapport au revenu total</span>
            </span>
            <span
              className="overview-box-percentage"
              style={{ float: !rtl ? "right" : "left" }}
            >
              {`${(
                (sharedData?.details?.totalCredit /
                  sharedData?.details?.totalbalance) *
                100
              ).toFixed(2)} %`}
            </span>
          </p>
        </Cards>
      </div>
    </OverviewCard>
  );
}

export default DailyOverview;