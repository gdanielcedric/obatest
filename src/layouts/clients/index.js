/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
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
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Navigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";

import { MDBDataTable } from "mdbreact";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// eslint-disable-next-line import/no-extraneous-dependencies
import "@fortawesome/fontawesome-free/css/all.min.css";
// eslint-disable-next-line import/no-extraneous-dependencies
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const local_endpoint = process.env.REACT_APP_LOCAL_ENDPOINT;

function Clients() {
  const tken = sessionStorage.getItem("accessToken");
  // const [clients, setClients] = useState([]);
  const [data, setData] = useState({});
  const [msgNotif, setMsgNotif] = useState("");
  const [state, setState] = React.useState({
    openn: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, openn } = state;

  const showMsg = (msg) => {
    setMsgNotif(msg);
    setState({ openn: true, vertical: "top", horizontal: "center" });
  };

  const getData = (res) => {
    const dta = {
      columns: [],
      rows: [],
    };
    // affect results to rows
    dta.rows = res;
    // format column
    Object.keys(res[0]).forEach((key) => {
      dta.columns.push({
        label: key,
        field: key,
        sort: "asc",
      });
    });
    // set data
    setData(dta);
  };

  const loadClients = () => {
    axios({
      method: "get",
      // eslint-disable-next-line camelcase
      url: `${local_endpoint}api/clients/allClients`,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((Response) => {
        if (Response.status !== 200) {
          throw new Error("Access denied");
        }
        // get result
        const result = Response.data;

        if (result.status) {
          console.log("Liste clients :", result.res);
          // bind clients
          // setClients(result.res);
          // dta
          getData(result.res);
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCloseNotif = () => {
    setState({ ...state, openn: false });
  };

  return tken ? (
    <DashboardLayout>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openn}
        onClose={handleCloseNotif}
        message={msgNotif}
        key={vertical + horizontal}
      />
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MDBDataTable striped bordered small data={data} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  ) : (
    <Navigate replace to="/authentication/sign-in" />
  );
}

export default Clients;
