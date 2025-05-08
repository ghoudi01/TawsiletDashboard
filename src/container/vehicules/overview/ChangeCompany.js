import { AutoComplete, Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCompanies, getCompanyList } from "../../../redux/User/userSlice";
import {
  getVehicule,
  updateVehicule,
} from "../../../redux/vehicule/vehiculeSlice";

function ChangeCompany({ visible, onCancel, record }) {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state?.user?.companyList);
  const meta = useSelector((state) => state?.user?.meta);
  const [options, setOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [toUpdate, setToUpdate] = useState({
    data: {
      ...record?.attributes,
      company: record?.company_id?.data?.documentId,
    },
  });
  console.log("🚀 ~ ChangeCompany ~ record:", record);

  useEffect(() => {
    if (visible) {
      dispatch(getCompanyList());
    }
  }, [visible]);

  const companyList = companies?.map((el) => ({
    value: el?.documentId,
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

  return (
    <Modal
      type={state.modalType}
      title="Assigné une Société"
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      {" "}
      <AutoComplete
        className="create_reservation_select"
        options={companyList}
        onSelect={(companyId) => {
          const selectedCompany = companyList.find(
            (option) => option.value === companyId
          );

          setToUpdate((prevToUpdate) => ({
            data: {
              ...prevToUpdate.data,
              company: companyId,
            },
          }));

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
      />
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
                updateVehicule({
                  id: record?.id,
                  vehicule: toUpdate,
                })
              ).then(() => dispatch(getVehicule()));
              handleCancel();
            }
          }}
        >
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}

export default ChangeCompany;
