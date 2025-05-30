import React, { useEffect, useState } from "react";
import { AutoComplete, Button, Modal, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDriver } from "../../../redux/User/userSlice";
import { addHistorique, getHistorique } from "../../../redux/chartContent/chartSlice";

function AddHistorique({ visible, onCancel }) {
  const dispatch = useDispatch();
  const drivers = useSelector((state) => state?.user?.drivers?.results ?? []);
  const pagination = useSelector(
    (state) => state?.user?.drivers?.pagination ?? {}
  );
  const currentUser = useSelector((state) => state.user.currentUser);

  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [montant, setMontant] = useState("");
  const [transactionType, setTransactionType] = useState("virement");
  const [type, setType] = useState(true); // true = income, false = outcome

  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [searchText, setSearchText] = useState("");

  // Fetch drivers when modal is visible or when page/searchText changes
  useEffect(() => {
    if (visible) {
      dispatch(getDriver({ page, pageSize, text: searchText }));
    }
  }, [visible, page, pageSize, searchText, dispatch]);

  // Prepare options for AutoComplete
  const driverOptions = drivers.map((driver) => ({
    value: driver.id,
    label: `${driver.lastName} ${driver.firstName} (${driver.email})`,
  }));

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1); // reset to first page on new search
  };

  const handleSelect = (driverId) => {
    const selected = driverOptions.find((opt) => opt.value === driverId);
    setSelectedDriverId(driverId);
    setSelectedLabel(selected?.label || "");
  };

  const handleSubmit = () => {
    if (!selectedDriverId || !montant) {
      // Add your validation here
      return;
    }

    dispatch(
      addHistorique({
        data: {
          sender: selectedDriverId,
          reciever: currentUser.id,
          sold: montant,
          transactionType: type ? "incomes" : "outcomes",
          payType: transactionType,
        },
      })
    ).then(() => dispatch(getHistorique()));

    // Clear form and close modal
    setMontant("");
    setSelectedLabel("");
    setSelectedDriverId(null);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="Nouvelle Transaction"
    >
      <Button onClick={() => setType(!type)} disabled>
        {type ? "Passer à Dépense" : "Passer à Revenus"}
      </Button>

      <h1>
        {type
          ? "Le chauffeur que vous sélectionnez vous a payé :"
          : "Vous avez payé au chauffeur sélectionné :"}
      </h1>

      <div style={{ display: "flex", gap: 20, width: "100%" }}>
        <AutoComplete
          options={driverOptions}
          onSelect={handleSelect}
          onSearch={handleSearch}
          placeholder="Rechercher chauffeur par nom ou email..."
          value={selectedLabel}
          onChange={setSelectedLabel}
          filterOption={(inputValue, option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          }
          style={{ flexGrow: 1 }}
        />

        <Input
          placeholder="Montant en chiffre"
          style={{ width: "30%" }}
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          type="number"
        />

        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="virement">Virement</option>
          <option value="espece">Espèce</option>
          <option value="cheque">Chèque bancaire</option>
        </select>
      </div>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 10 }}>
          Annuler
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}

export default AddHistorique;
