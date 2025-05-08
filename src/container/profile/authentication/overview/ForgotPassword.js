import React, { useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { Form, Input, Button } from "antd";

import { AuthWrapper } from "./style";
import Heading from "../../../../components/heading/heading";
import { forgetPassword } from "../../../../redux/User/userSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function ForgotPassword() {
  const [state, setState] = useState({
    values: null,
  });
  const [forgetState, setForgetState] = useState(null);
  const [email, setEmail] = useState("");
  // const [loading, setLoading] = useState(true); // Change initial state to false

  const dispatch = useDispatch();
  const handleForgetPassword = async () => {
    try {
      const res = await dispatch(forgetPassword({ email: email }));
      if (res?.payload?.ok) {
        setForgetState(true);
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } else {
        setForgetState(false);
      }
    } catch (error) {
    }
  };
  return (
    <AuthWrapper>
      <div className="auth-contents grid-form">
        <Form name="forgotPass" layout="vertical">
          <Heading as="h3">Mot de passe oublié ?</Heading>
          <p className="forgot-text">
            Veuillez saisir l'adresse e-mail que vous avez utilisée lors de
            votre inscription, et nous vous enverrons des instructions pour
            réinitialiser votre mot de passe.
          </p>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre adresse e-mail !",
                type: "email",
              },
            ]}
          >
            <Input
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            {forgetState === false ? (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "11px",
                  marginTop: "7px",
                  color: "#d0342c",
                }}
              >
                Adresse email n'existe pas!
              </p>
            ) : forgetState === true ? (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "11px",
                  marginTop: "7px",
                  color: "#5F63F2",
                }}
              >
                un email a été envoyer avec succés
              </p>
            ) : null}
          </Form.Item>

          <Form.Item>
            <Button
              className="btn-reset"
              htmlType="submit"
              type="primary"
              size="large"
              onClick={() => {
                handleForgetPassword();
              }}
            >
              Envoyer les instructions de réinitialisation
            </Button>
          </Form.Item>
          <p className="return-text">
            Retour à <NavLink to="/">Se connecter</NavLink>
          </p>
        </Form>
      </div>
    </AuthWrapper>
  );
}

export default ForgotPassword;
