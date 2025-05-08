import React from "react";
import { NavLink } from "react-router-dom";
import { ErrorWrapper } from "./style";
import { Main } from "../styled";
import Heading from "../../components/heading/heading";
import { Button } from "../../components/buttons/buttons";

function NotFound() {
  return (
    <Main>
      <ErrorWrapper>
        <img
          src={require(`../../static/img/pages/404.svg`).default}
          alt="404"
        />
        <Heading className="error-text" as="h3">
          401
        </Heading>
        <p>
          Désolé, votre rôle ne permet pas l'accès à cette page. Contactez-nous
          pour de l'aide.
        </p>
        <NavLink to="/admin">
          <Button size="default" type="primary" to="/admin">
          Retourner à la page d'accueil.
          </Button>
        </NavLink>
      </ErrorWrapper>
    </Main>
  );
}

export default NotFound;
