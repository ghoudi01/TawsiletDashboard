import { AutoComplete, Button, Modal, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCompanies, getCompanyList } from "../../../redux/User/userSlice";
import {
  addHistorique,
  getHistorique,
} from "../../../redux/chartContent/chartSlice";

function AddHistorique({ visible, onCancel, record }) {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state?.user?.companyList);

  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    if (visible) {
      dispatch(getCompanyList());
    }
  }, [visible]);

  const companyList = companies?.map((el) => ({
    value: el?.id,
    label: el?.name,
  }));

  const [state, setState] = useState({
    visible,
    modalType: "primary",
    checked: [],
  });

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      setState({
        visible,
      });
    }

    return () => {
      unmounted = true;
    };
  }, [visible]);

  const handleCancel = () => {
    onCancel();
  };
  const [type, settype] = useState(true);
  const [id, setId] = useState();
  const [montant, setMontant] = useState();
  const [transactionType, settransactionType] = useState("virement");

  return (
    <Modal
      type={state.modalType}
      title="Nouvelle Transaction"
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      {type ? (
        <div className="modalT">
          <Button onClick={() => settype(false)}> revenus</Button>
          <h1>La société que tu vas selectionner vous a payer :</h1>
          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            <AutoComplete
              className="create_reservation_select"
              options={companyList}
              onSelect={(companyId) => {
                const selectedCompany = companyList.find(
                  (option) => option.value === companyId
                );

                setId(companyId);

                setSelectedLabel(selectedCompany?.label);
              }}
              placeholder={
                companyList?.length === 0
                  ? "Aucun société disponible"
                  : "Choisir une société ..."
              }
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e)}
              filterOption={(inputValue, option) =>
                option.label.includes(inputValue.toUpperCase())
              }
            />{" "}
            <Input
              placeholder="Montant en chiffre"
              style={{ width: "30%", height: "38px" }}
              onChange={(e) => setMontant(e.target.value)}
              value={montant}
            />
            <select onChange={(e) => settransactionType(e.target.value)}>
              <option value="virement">Virement</option>
              <option value="espece">Espece</option>
              <option value="cheque">Cheque bancaire</option>
            </select>
          </div>
          <div key="1" className="project-modal-footer">
            <Button
              size="default"
              className="btn_Suivant"
              key="back"
              outlined
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              size="default"
              type="primary"
              className="btn_ADD"
              key="submit"
              onClick={() => {
                {
                  dispatch(
                    addHistorique({
                      data: {
                        sender: id,
                        reciever: 227,
                        sold: montant,
                        transactionType: "incomes",
                        payType: transactionType,
                      },
                    })
                  ).then((res) => dispatch(getHistorique()));
                  setMontant(null);
                  setSelectedLabel("");
                  handleCancel();
                }
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <div className="modalT">
          <Button onClick={() => settype(true)}>Dépense</Button>
          <h1>Vous avez Payer à la société selectionner :</h1>
          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            <AutoComplete
              className="create_reservation_select"
              options={companyList}
              onSelect={(companyId) => {
                const selectedCompany = companyList.find(
                  (option) => option.value === companyId
                );
                setId(companyId);

                setSelectedLabel(selectedCompany?.label);
              }}
              placeholder={
                companyList?.length === 0
                  ? "Aucun société disponible"
                  : "Choisir une société ..."
              }
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e)}
              filterOption={(inputValue, option) =>
                option.label.includes(inputValue.toUpperCase())
              }
            />{" "}
            <Input
              placeholder="Montant en chiffre"
              style={{ width: "30%", height: "38px" }}
              onChange={(e) => setMontant(e.target.value)}
            />
            <select onChange={(e) => settransactionType(e.target.value)}>
              <option value="virement">Virement</option>
              <option value="espece">Espece</option>
              <option value="cheque">Cheque bancaire</option>
            </select>
          </div>
          <div key="1" className="project-modal-footer">
            <Button
              size="default"
              className="btn_Suivant"
              key="back"
              outlined
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              size="default"
              type="primary"
              className="btn_ADD"
              key="submit"
              onClick={() => {
                {
                  dispatch(
                    addHistorique({
                      data: {
                        sender: 227,
                        reciever: id,
                        sold: montant,
                        transactionType: "outcomes",
                        payType: transactionType,
                      },
                    })
                  ).then((res) => dispatch(getHistorique()));
                  handleCancel();
                }
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default AddHistorique;
