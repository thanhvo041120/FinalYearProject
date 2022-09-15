import { LoginFormComponent, RegisterFormComponent } from "components/forms";
import React from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import login  from 'assets/img/login.jpg'
import register from 'assets/img/background.jpg'

const LoginPage = () => {
  const state = useLocation();
  let image: any;
  state.pathname === "/login" ?  image = login : image = register;
  return (
    <div className="login-container">
      <div className="column-container">
        <div className="row-container">
          <div className="form">
            <div className="form-login">
              <div className="image-block">
                <img className="image-login" src={image} alt="" />
              </div>
              <div className="content">
                <div>
                  {state.pathname === "/login" ? (
                    <div>
                      <LoginFormComponent />
                    </div>
                  ) : (
                    <div>
                      <RegisterFormComponent />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
