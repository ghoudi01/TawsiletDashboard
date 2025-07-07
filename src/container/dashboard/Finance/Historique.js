import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addHistorique,
  getHistorique,
  deleteHistorique,
} from "../../../redux/chartContent/chartSlice";
import { useSelector } from "react-redux";
import { Row, Col, Table, Spin, Input } from "antd";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Modal, message, Switch, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AddHistorique from "./AddHistorique";
import { Button } from "../../../components/buttons/buttons";
import FeatherIcon from "feather-icons-react";
const Historique = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHistorique());
  }, []);
  const { historique, current } = useSelector((state) => {
    return {
      historique: state?.charts?.historique?.data,

      current: state.user.currentUser,
    };
  });
  const dataSource = historique
    ?.filter((el) =>
      current.user_role === ("owner" || "admin")
        ? el
        : el?.sender?.id === current.id ||
          el?.reciever?.id === current.id
    )
    .map((el) => {
       console.log("el?.sender?.data",el?.sender)
      return {
        type: el?.transactionType === "incomes" ? "Revenus" : "Payement",
        sender:
          el?.sender?.user_role === "owner"
            ? "Tawsilet"
            : el?.sender?.firstName+" "+el?.sender?.lastName,
        reciever:
          el?.reciever?.user_role === "owner"
            ? "Tawsilet"
            : el?.reciever?.firstName+" "+el?.reciever?.lastName,
        Montant: `${el?.sold} TND`,
        methode: el?.payType,
        evidence: el?.evidence ? (
          <a href={el.evidence.url} target="_blank" rel="noopener noreferrer">
            <FeatherIcon icon="file" size={16} />
          </a>
        ) : null,
        delete:
          current.user_role === ("owner") ? (
            <FeatherIcon
              style={{ color: "red", cursor: "pointer" }}
              icon="trash"
              size={16}
              onClick={() =>
                Modal.confirm({
                  title: "Confirmation D'action",
                  content:
                    "Etes vous sure de vouloir Supprimer cette transaction ",
                  okText: "Oui",
                  okType: "danger",
                  cancelText: "Annuler",
                  onOk() {
                    dispatch(deleteHistorique(el?.documentId)).then((res) =>
                      dispatch(getHistorique())
                    );
                  },
                })
              }
            />
          ) : null,
      };
    });

  const columns = [
    {
      title: "Type de transaction",
      dataIndex: "type",
      key: "Type de transaction",
    },

    {
      title: "Payer par",
      dataIndex: "sender",
      key: "Payer par:",
    },
    {
      title: "Recue par",
      dataIndex: "reciever",
      key: "Recue par",
    },
    {
      title: "Montant",
      dataIndex: "Montant",
      key: "Montant",
    },
    {
      title: "Methode de payment",
      dataIndex: "methode",
      key: "Montant",
    },
    {
      title: "PREUVE",
      dataIndex: "evidence",
      key: "evidence",
    },
    {
      title: "",
      dataIndex: "delete",
      key: "delete",
    },
  ];

  const [open, setopen] = useState(false);
  const onCancel = () => {
    setopen(false);
  };

  return (
    <div style={{ marginTop: "5vh" }}>
      {current.user_role === ("owner" || "admin") ? (
        <Button
          key="1"
          type="primary"
          size="default"
          className="btn_Suivant"
          onClick={() => setopen(true)}
          style={{ marginBottom: "6vh", marginLeft: "3vw" }}
        >
          <FeatherIcon icon="plus" size={16} /> Ajouter une transaction
        </Button>
      ) : null}
      <Main>
        <Row gutter={30}>
          <Col sm={24} xs={24} className="mb-25">
            <Cards headless>
              {/* calcule cours */}
              <div>
                <h1 style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                  Historique des Transactions
                </h1>

                {/* table */}
                <Table
                  className="table-responsive"
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                />

                {/* table */}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
      <AddHistorique visible={open} onCancel={onCancel} />
    </div>
  );
};

export default Historique;
