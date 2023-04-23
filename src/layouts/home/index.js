/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
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
import { Modal, Box, Button, TextField, Card, Divider, Icon } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

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

// appname
const app = process.env.REACT_APP_APPNAME;
// eslint-disable-next-line camelcase
const endpoint_oba = process.env.REACT_APP_OBA_ENDPOINT;
// eslint-disable-next-line camelcase
const local_endpoint = process.env.REACT_APP_LOCAL_ENDPOINT;

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
  const [access_token, setAccessToken] = useState();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [infoCred, setInfoCred] = useState({});
  const [idClt, setIdClt] = useState("");
  const [idPrd, setIdPrd] = useState("");
  const [number, setNumber] = useState("");
  const [amountt, setAmount] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [msgNotif, setMsgNotif] = useState("");
  const [vsBox, setVsBox] = useState("none");
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

  const loadProducts = (token) => {
    axios({
      method: "get",
      // eslint-disable-next-line camelcase
      url: `${local_endpoint}api/products/allProducts`,
      mode: "cors",
      // headers: {
      //   Authorization: token,
      // },
    })
      .then((Response) => {
        if (Response.status !== 200) {
          throw new Error("Access denied");
        }
        // get result
        const result = Response.data;
        console.log("resultat", result);

        // bind products
        if (result.status) setProducts(result.res);
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        showMsg(Error.response.statusText);
      });
  };

  const initializApp = () => {
    const dta = { appname: app };
    axios({
      method: "post",
      url: `${local_endpoint}api/Token/reGenToken`,
      data: dta,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((Response) => {
        console.log("response initializ", Response);

        if (Response.status === 200) {
          // affect result
          const result = Response.data;
          if (result.status) {
            // save in access_token
            setAccessToken(result.access_token);
            // save in session
            // sessionStorage.setItem("access_token", result.access_token);
            // load all products
          }
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
    initializApp();
    loadProducts();
  }, []);

  const getInfoCredit = (val) => {
    const dta = { id: val };
    axios
      .post(`${local_endpoint}api/credits/findCreditById`, dta)
      .then((Response) => {
        // get result
        const result = Response.data;

        showMsg(result.msg);

        // eslint-disable-next-line no-empty
        if (result.status) {
          setInfoCred(result.res[0]);
          setVsBox("flex");
          setSelectedProduct({});
          setAmount(0);
          setNumber("");
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  const saveCredit = () => {
    const dta = {
      idClient: idClt,
      idProduct: idPrd,
      amount: parseInt(amountt, 10),
      durationInDays: selectedProduct.durationInDays,
      minAmount: selectedProduct.minAmount,
      maxAmount: selectedProduct.maxAmount,
    };
    axios
      .post(`${local_endpoint}api/credits/insertCredit`, dta)
      .then((Response) => {
        // get result
        const result = Response.data;

        showMsg(result.msg);

        // eslint-disable-next-line no-empty
        if (result.status) {
          getInfoCredit(result.res[0]);
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  const saveClient = (val) => {
    console.log("numero", val);
    const dta = { phone: val };
    axios
      .post(`${local_endpoint}api/clients/insertClient`, dta)
      .then((Response) => {
        // get result
        const result = Response.data;

        showMsg(result.msg);

        if (result.status) {
          //
          if (result.msg === "OK") setIdClt(result.res[0]);
          else setIdClt(result.res[0].id);

          // save credit
          saveCredit();
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  const checkExistNumber = (val) => {
    console.log("numero", val);
    const dta = { phone: val };
    axios
      .post(`${local_endpoint}api/credits/findCreditByPhone`, dta)
      .then((Response) => {
        // get result
        const result = Response.data;

        // notif
        showMsg(result.msg);

        if (result.status) {
          setInfoCred(result.res);
          setVsBox("flex");
          setSelectedProduct({});
          setAmount(0);
          setNumber("");
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 404) saveClient(val);
        else if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  const saveProduct = (val) => {
    console.log("product", val);
    const dta = {
      code: val.code,
      minAmount: val.minAmount,
      maxAmount: val.maxAmount,
      creditFeesAmount: val.creditFeesAmount,
      interestRate: val.interestRate,
      durationInDays: val.durationInDays,
    };
    axios
      .post(`${local_endpoint}api/products/insertProduct`, dta)
      .then((Response) => {
        // get result
        const result = Response.data;

        showMsg(result.msg);

        if (result.status) {
          setIdPrd(result.res[0]);
          // verifier si l'utilisateur n'a pas deja contracte de pret
          checkExistNumber(number);
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

  const checkExistProduct = (val) => {
    console.log("code", val.code);
    const dta = { code: val.code };
    axios
      // eslint-disable-next-line camelcase
      .post(`${local_endpoint}api/products/findProduct`, dta)
      .then((Response) => {
        console.log("response", Response);
        // get result
        const result = Response.data;

        // notif
        showMsg(result.msg);

        if (result.status) {
          setIdPrd(result.res[0].id);

          // verifier si l'utilisateur n'a pas deja contracte de pret
          checkExistNumber(number);
        }
      })
      .catch((Error) => {
        console.log("Erreur :", Error);
        const err = Error.response;
        if (err.status === 404) saveProduct(val);
        else if (err.status === 500) showMsg(err.statusText);
        else showMsg(err.data.msg);
      });
  };

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

  const handleCloseNotif = () => {
    setState({ ...state, openn: false });
  };

  const handleSubmit = () => {
    console.log("produit selectionne", selectedProduct);
    console.log("montant souhaite", amountt);
    console.log("numero de telephone", number);
    //
    handleClose();
    // verifier l'existence du produit dans notre bd locale
    checkExistProduct(selectedProduct);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openn}
        onClose={handleCloseNotif}
        message={msgNotif}
        key={vertical + horizontal}
      />
      <PageLayout>
        <DefaultNavbar />
        <MDBox py={3}>
          <MDBox mt={4.5}>
            <img src={bgImg} className="Imgg" alt="votre pret en temps reel" />
          </MDBox>
          <MDBox mt={4.5}>
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
          <MDBox mt={4.5}>
            <Grid container spacing={3} style={{ display: vsBox }}>
              <Grid item xs={12} md={6} lg={8}>
                <Card id="detail" style={{ backgroundColor: "#fe914d" }}>
                  <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
                    <tr className="wtr">
                      <td className="left_t"> Code Produit </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.codeProduct} </td>
                    </tr>
                    <Divider />
                    <tr className="wtr">
                      <td className="left_t"> Credit contracté le </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.creationDate} </td>
                    </tr>
                    <tr className="wtr">
                      <td className="left_t"> Delai de remboursement </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.durationInDays} jours</td>
                    </tr>
                    <tr className="wtr">
                      <td className="left_t"> Date de remboursement</td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.issueDate} </td>
                    </tr>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Card id="detail" style={{ backgroundColor: "#000" }}>
                  <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
                    <tr className="wtr">
                      <td className="left_t"> Montant demande </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.requestedAmount} XOF </td>
                    </tr>
                    <tr className="wtr">
                      <td className="left_t"> Frais de souscription </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.creditFeesAmount} XOF </td>
                    </tr>
                    <tr className="wtr">
                      <td className="left_t"> Taux intérêt </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.interestRate} % </td>
                    </tr>
                    <tr className="wtr">
                      <td className="left_t"> Montant à rembourser </td>
                      <td> : </td>
                      <td className="right_t"> {infoCred.dueAmount} XOF </td>
                    </tr>
                  </MDBox>
                </Card>
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
              value={amountt}
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
