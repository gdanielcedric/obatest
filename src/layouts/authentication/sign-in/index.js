/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { Navigate } from "react-router-dom";

export default function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [usrname, setUsername] = useState("");
  const [pwd, setPassword] = useState("");
  const [msgNotif, setMsgNotif] = useState("");
  const [state, setState] = React.useState({
    openn: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, openn } = state;
  const [accessToken, setAccessToken] = useState();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSetUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleCloseNotif = () => {
    setState({ ...state, openn: false });
  };

  const showMsg = (msg) => {
    setMsgNotif(msg);
    setState({ openn: true, vertical: "top", horizontal: "center" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dta = { username: usrname, password: pwd };
    axios
      .post("../api/users/findUser", dta)
      .then((Response) => {
        // get result
        const result = Response.data;

        // notif
        showMsg(result.msg);

        // eslint-disable-next-line no-empty
        if (result.status) {
          setAccessToken(result.accessToken);
          // save into variable session
          sessionStorage.setItem("accessToken", result.accessToken);
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  return accessToken ? (
    <Navigate replace to="/dashboard" />
  ) : (
    <BasicLayout>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openn}
        onClose={handleCloseNotif}
        message={msgNotif}
        key={vertical + horizontal}
      />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            SE CONNECTER
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Identifiant"
                value={usrname}
                onChange={handleSetUsername}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mot de passe"
                value={pwd}
                onChange={handleSetPassword}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;SE SOUVENIR
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="warning" onClick={handleSubmit} fullWidth>
                se connecter
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}
