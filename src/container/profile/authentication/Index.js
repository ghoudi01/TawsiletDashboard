import React from "react";
import { Row, Col } from "antd";
import { Aside, Content } from "./overview/style";
import Heading from "../../../components/heading/heading";

const AuthLayout = (WraperContent) => {
  return function () {
    return (
      <Row justify={"center"} align={"center"}>
        <Col xl={12} lg={0}>
          <Aside></Aside>
        </Col>

        <Col xl={12} lg={24}>
          <WraperContent />
        </Col>
      </Row>
    );
  };
};

export default AuthLayout;
