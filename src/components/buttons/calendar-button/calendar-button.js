import React from "react";
import FeatherIcon from "feather-icons-react";
import { Popover } from "../../popup/popup";
import { DateRangePickerOne } from "../../datePicker/datePicker";
import { Button } from "../buttons";

const CalendarButtonPageHeader = ({ date }) => {
  const content = (
    <>
      <DateRangePickerOne  date={date} />
    </>
  );

  return (
    <Popover
      placement="bottomRight"
      title="Recherche par date"
      content={content}
      action="hover"
    >
      <Button size="small" className="btn_Suivant">
        <FeatherIcon icon="calendar" size={14} />
        Calendrier
      </Button>
    </Popover>
  );
};

export { CalendarButtonPageHeader };
