import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CounterContainer = styled.div`
  font: 800 24px system-ui;
  position: relative;
`;

const Counter = ({ endValue, incrementDuration }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCurrentValue((prevValue) => prevValue + 1);
    };

    const countInterval = setInterval(() => {
      if (currentValue < endValue) {
        updateCount();
      } else {
        clearInterval(countInterval);
      }
    }, incrementDuration);

    return () => {
      clearInterval(countInterval);
    };
  }, [currentValue, endValue, incrementDuration]);

  return (
    <CounterContainer data-count={currentValue}>
      {currentValue}
    </CounterContainer>
  );
};

Counter.propTypes = {
  endValue: PropTypes.number.isRequired,
  incrementDuration: PropTypes.number.isRequired,
};

export default Counter;
