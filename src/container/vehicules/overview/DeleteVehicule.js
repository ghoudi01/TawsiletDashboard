import React, { useState, useEffect } from "react";
import { Form, Input, Select, Col, Row, DatePicker } from "antd";
import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";
import { Modal } from "../../../components/modals/antd-modals";
import { CheckboxGroup } from "../../../components/checkbox/checkbox";
import { BasicFormWrapper } from "../../styled";

const { Option } = Select;
const dateFormat = "MM/DD/YYYY";

function DeleteVehicule({ visible, onCancel }) {
  const [form] = Form.useForm();

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

  const handleOk = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  const options = [
    {
      label: "Privet",
      value: "privet",
    },
    {
      label: "Team",
      value: "team",
    },
    {
      label: "Public",
      value: "public",
    },
  ];

  return (
    <Modal
      type={state.modalType}

      width={500}
    
      title="Supprimer Véhicule"

      visible={state.visible}
      footer={[
        <div key="1" className="project-modal-footer">
          <Button size="default" type="primary" key="submit" onClick={handleOk}>
            Supprimer Vehicule
          </Button>
          <Button
            size="default"
            type="white"
            key="back"
            outlined
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>,
      ]}
      onCancel={handleCancel}
    >
      <div className="project-modal">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 38 38"
          fill="none"
        >
          <g clip-path="url(#clip0_2738_105680)">
            <path
              d="M32.435 5.56496C28.8465 1.97636 24.075 0 19 0C13.925 0 9.15355 1.97636 5.56496 5.56496C1.97636 9.15355 0 13.925 0 19C0 24.0753 1.97636 28.8465 5.56496 32.435C9.15355 36.0236 13.925 38 19 38C24.075 38 28.8465 36.0236 32.435 32.435C36.0236 28.8465 38 24.0753 38 19C38 13.925 36.0236 9.15355 32.435 5.56496ZM27.218 24.5937C27.9425 25.3185 27.9425 26.4932 27.218 27.2177C26.8556 27.5801 26.3807 27.7613 25.9058 27.7613C25.4309 27.7613 24.9561 27.5801 24.5937 27.2177L19 21.624L13.4063 27.218C13.0439 27.5801 12.5691 27.7613 12.0942 27.7613C11.6193 27.7613 11.1444 27.5801 10.782 27.218C10.0575 26.4932 10.0575 25.3185 10.782 24.5939L16.376 19L10.782 13.4063C10.0575 12.6815 10.0575 11.5068 10.782 10.7823C11.5068 10.0575 12.6815 10.0575 13.4061 10.7823L19 16.376L24.5937 10.7823C25.3185 10.0578 26.4932 10.0575 27.2177 10.7823C27.9425 11.5068 27.9425 12.6815 27.2177 13.4063L21.624 19L27.218 24.5937Z"
              fill="#CD3636"
            />
          </g>
        </svg>
        <h3>Supprimer Vehicule ?</h3>
        <h4>

        </h4>

      </div>
    </Modal>
  );
}

DeleteVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default DeleteVehicule;
