import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AuthWrapper, ButtonSign } from "./style";

import Heading from "../../../../components/heading/heading";
import { loginUserTodash } from "../../../../redux/User/userSlice";

function SignIn() {
  const history = useHistory();

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state?.user?.isLoading);
  const isAuth = localStorage.getItem("token");
  const [form] = Form.useForm();
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [state, setState] = useState({
    checked: null,
  });

  useEffect(() => {
    if (isAuth) {
      history.push("/strikingdash-react/admin");
    }
  }, []);

  const handleSubmit = () => {
    dispatch(loginUserTodash(credentials));
  };

 
  return (
    <AuthWrapper>
      <div className="auth-contents">
        <div className="signin_logo_tawsilet">
          <img src="images/tawsiletlogo.svg" alt="" />
        </div>
        <Form
          name="login"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Heading as="h3">
            Connectez-vous à <span className="span_yellow">Tawsilet</span>
          </Heading>
          <Form.Item
            name="username"
            rules={[
              {
                message: "Veuillez saisir votre e-mail !",
                required: true,
              },
            ]}
            label="Adresse e-mail"
          >
            <Input
              placeholder="nom@example.com"
              onChange={(e) => {
                setCredentials({ ...credentials, identifier: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item name="password" label="Mot de passe">
            <Input.Password
              placeholder="Mot de passe"
              onChange={(e) => {
                setCredentials({ ...credentials, password: e.target.value });
              }}
            />
          </Form.Item>
          <div className="auth-form-action">
            <Link className="forgot-pass" to='/forgot-password'>j'ai oublié mon mot de passe</Link>
            {/* <NavLink className="forgot-pass-link" to="#">
            Mot de passe oublié?
            </NavLink> */}
          </div>
          <Form.Item>
            <ButtonSign
              className="btn-signin"
              htmlType="submit"
              type="primary"
              size="large"
            >
              {isLoading ? "Chargement..." : "S'identifier"}
            </ButtonSign>
          </Form.Item>
        </Form>
      </div>
    </AuthWrapper>
  );
}

export default SignIn;
