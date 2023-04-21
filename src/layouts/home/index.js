/* eslint-disable no-console */
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

// @mui material components
import Grid from "@mui/material/Grid";
import { Modal, Box, Button, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Footer from "examples/Footer";

// import custom css
import "../../assets/css/custom.css";

import bgImg from "../../assets/images/65ce3706-19b0-4cd7-be4f-b14f8e6e4ab3.jpg";
import bordereauImg from "../../assets/images/oba_bordereau.png";

// eslint-disable-next-line camelcase
const endpoint_oba = process.env.REACT_APP_OBA_ENDPOINT;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxWidth: "100%",
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function Home() {
  // Declare variables
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    axios({
      method: "get",
      // eslint-disable-next-line camelcase
      url: endpoint_oba,
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
        console.log("resultat", result.produit);
        // bind products
        setProducts(result.produit);
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
      });
  }, []);

  const handleTake = (value) => {
    console.log("selected value", value);
    setSelectedProduct(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetNumber = (event) => {
    setNumber(event.target.value);
  };

  const handleSetAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = () => {
    console.log("produit selectionne", selectedProduct);
    console.log("montant souhaite", amount);
    console.log("numero de telephone", number);
  };

  return (
    <>
      <PageLayout>
        <DefaultNavbar />
        <MDBox py={3}>
          <MDBox>
            <img src={bgImg} className="Imgg" alt="votre pret en temps reel" />
          </MDBox>
          <MDBox>
            <img src={bordereauImg} className="Imgg" alt="voir nos offres" />
          </MDBox>
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              {products.map((value, index) => (
                <Grid item xs={12} md={6} lg={4} id={index}>
                  <Card id={index}>
                    <MDBox p={2} mx={3} display="flex" justifyContent="left">
                      <MDBox
                        display="grid"
                        justifyContent="center"
                        alignItems="center"
                        bgColor="dark"
                        color="white"
                        width="2rem"
                        height="2rem"
                        shadow="md"
                        borderRadius="lg"
                        variant="gradient"
                      >
                        <Icon fontSize="default">money</Icon>
                      </MDBox>
                    </MDBox>
                    <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
                      <tr>
                        <td className="left_t"> Nom du Pack </td>
                        <td> : </td>
                        <td className="right_t"> {value.code} </td>
                      </tr>
                      <tr>
                        <td className="left_t"> Nombre de jours </td>
                        <td> : </td>
                        <td className="right_t"> {value.durationInDays} jours </td>
                      </tr>
                      <Divider />
                      <tr>
                        <td className="left_t"> Montant minimum </td>
                        <td> : </td>
                        <td className="right_t"> {value.minAmount} XOF </td>
                      </tr>
                      <tr>
                        <td className="left_t"> Montant maximum </td>
                        <td> : </td>
                        <td className="right_t"> {value.maxAmount} XOF</td>
                      </tr>
                      <tr>
                        <td className="left_t"> Frais emprunt </td>
                        <td> : </td>
                        <td className="right_t"> {value.creditFeesAmount} XOF </td>
                      </tr>
                      <Divider />
                      <tr>
                        <td className="left_t"> Taux interet </td>
                        <td> : </td>
                        <td className="right_t"> {value.interestRate} % </td>
                      </tr>
                      <Divider />
                      <button onClick={() => handleTake(value)} type="button" className="bton_oba">
                        Prendre
                      </button>
                    </MDBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </MDBox>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={8}>
                Bloc 4
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                Bloc 5
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <Footer />
      </PageLayout>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <h2 id="child-modal-title">Faites votre demande</h2>
          <p id="child-modal-description">
            Veuillez saisir votre numero de telephone et le montant souhaite dans le formulaire
            ci-dessous :
          </p>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Numero de telephone"
              variant="standard"
              value={number}
              onChange={handleSetNumber}
              type="tel"
            />
            <TextField
              id="standard-basic"
              label="Montant souhaite"
              variant="standard"
              value={amount}
              onChange={handleSetAmount}
              type="number"
            />
            <button onClick={handleSubmit} type="button" className="bton_oba">
              Valider
            </button>
          </Box>
          <Button onClick={handleClose}>Fermer</Button>
        </Box>
      </Modal>
    </>
  );
}

export default Home;
