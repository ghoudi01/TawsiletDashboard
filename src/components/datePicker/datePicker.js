// eslint-disable-next-line max-classes-per-file
import React, { useState } from "react";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { DatePicker } from "antd";
import { ItemWraper, ButtonGroup } from "./style";
import { fr } from "date-fns/locale";
import { Button } from "../buttons/buttons";

import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
const DateRangePickerOne = ({ date }) => {
  const [state, setState] = useState({
    datePickerInternational: null,
    dateRangePicker: {
      selection: {
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: "selection",
      },
    },
  });

  const handleRangeChange = (which) => {
    setState({
      ...state,
      dateRangePicker: {
        ...state.dateRangePicker,
        ...which,
      },
    });
  };
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const { dateRangePicker } = state;
  const start = dateRangePicker.selection.startDate
    .toLocaleDateString("fr-FR", options)
    .split(" ");
  const end = dateRangePicker.selection.endDate
    .toLocaleDateString("fr-FR", options)
    .split(" ");

  return (
    <ItemWraper>
      <DateRangePicker
        onChange={handleRangeChange}
        showSelectionPreview
        moveRangeOnFirstSelection={false}
        className="PreviewArea"
        months={2}
        ranges={[dateRangePicker.selection]}
        direction="horizontal"
        locale={fr}
      />

      <ButtonGroup>
        <p>{`${start[1]} ${start[2]} ${start[3]} - ${end[1]} ${end[2]} ${end[3]}`}</p>
        <Button
          size="small"
          type="primary"
          onClick={() =>
            date({
              ...date,
              ...date,
              startDate: state.dateRangePicker.selection.startDate
                .toISOString()
                .slice(0, 10),
              endDate: state.dateRangePicker.selection.endDate
                .toISOString()
                .slice(0, 10),
            })
          }
        >
          Chercher
        </Button>
        <Button size="small" type="white" outlined>
          Annuler
        </Button>
      </ButtonGroup>
    </ItemWraper>
  );
};

class CustomDateRange extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  disabledStartDate = (startValue) => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange("startValue", value);
  };

  onEndChange = (value) => {
    this.onChange("endValue", value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;

    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          style={{ margin: "5px" }}
          locale={locale}
        />

        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={endValue}
          placeholder="End"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          style={{ margin: "5px" }}
          locale={locale}
        />
      </div>
    );
  }
}

export { DateRangePickerOne, CustomDateRange };
