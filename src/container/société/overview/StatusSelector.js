// StatusSelector.js
import React, { useCallback } from "react";
import { Select, Tag, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateCompany } from "../../../redux/company/companySlice";
import PropTypes from "prop-types";
import { getCompanies, getCompanyById } from "../../../redux/User/userSlice";

const StatusSelector = ({
  currentStatus,
  companyId,
  filterStatus,
  textFilter,
  ping,
  setPing
}) => {
  const dispatch = useDispatch();
  const meta = useSelector((state) => state?.user?.companies?.pageInfo);

 

  const statusOptions = [
    { value: "valid", label: "Validate", color: "green" },
    { value: "invalid", label: "Reject", color: "red" },
  ];

  const handleStatusChange = useCallback(async (newStatus) => {
   
    if (!companyId) {
      console.error("No company ID provided!");
      message.error("No company record found for status update.");
      return;
    }

    try {
      const hideLoading = message.loading("Updating status...", 0); // persistent loading message

      dispatch(
        updateCompany({
          id: companyId,
          company: { confirmed: newStatus === "valid" },
        })
      ).then(() => {
        dispatch(getCompanyById({ id: companyId }))
        setPing(!ping)
        hideLoading();
        message.success("Company status updated successfully!");
      });
    } catch (error) {
      console.error("Status update failed:", error);
      message.error("Failed to update company status. Please try again.");
    }
  }, [companyId, dispatch, textFilter, filterStatus]);

  return (
    <Select
      value={currentStatus} // Using value instead of defaultValue for controlled component
      onChange={handleStatusChange}
      style={{ width: 120 }}
      aria-label="Select company status"
    >
      {statusOptions.map((option) => (
        <Select.Option
          key={option.value}
          value={option.value}
          data-testid={`status-option-${option.value}`}
        >
          <Tag color={option.color}>{option.label}</Tag>
        </Select.Option>
      ))}
    </Select>
  );
};

StatusSelector.propTypes = {
  currentStatus: PropTypes.oneOf(["valid", "invalid"]).isRequired,
  companyId: PropTypes.string.isRequired,
};

export default StatusSelector;
