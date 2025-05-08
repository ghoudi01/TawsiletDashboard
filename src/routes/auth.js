import React, { lazy, Suspense } from "react";
import { Spin } from "antd";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthLayout from "../container/profile/authentication/Index";

const Login = lazy(() =>
  import("../container/profile/authentication/overview/SignIn")
);
const ForgotPassword = lazy(() =>
  import("../container/profile/authentication/overview/ForgotPassword")
);
function NotFound() {
  return <Redirect to="/" />;
}

function FrontendRoutes() {
  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route exact path="/" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route exact path="*" component={NotFound} />
      </Suspense>
    </Switch>
  );
}

export default AuthLayout(FrontendRoutes);
