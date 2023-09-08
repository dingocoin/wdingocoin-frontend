import "./App.scss";
import BscController from "./BscController";
import SolController from "./SolController";
import ReactGA from "react-ga";

// Controls.
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  DropdownButton,
  Row
} from "react-bootstrap";

// Assets.
import FadeInSection from "./FadeInSection";
import DingocoinLogo from "./assets/img/wDingocoin.png";

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Maintenance from "./Maintenance";

export default function App() {
 // GA Analytics, Uncomment below, add your GA Measurement ID 	
{/*
  ReactGA.initialize("ID-HERE");  <-- Enter GA Measurement ID Here
  ReactGA.pageview(window.location.pathname + window.location.search);

  const [location, setLocation] = React.useState(null);
  React.useEffect(() => {
    setLocation(window.location.pathname);
  }, []);
  React.useEffect(() => {}, [location]); */}

const [controller, setController] = React.useState(null);
  
{/* Maint Mode Toggle  'const maintenance' = -- true = on  | false = off */}
  const maintenance = false; 
  return (
    <Router>
      {maintenance ? (
        <Maintenance />
      ) : (
              <div className="App">
        <Navbar className="navbar" bg="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand href="/" className="navbar-brand align-items-center">
              <img alt="" src={DingocoinLogo} />
              <span>DINGOCOIN</span>
              <span className="navbar-brand-subtitle"> Wrap</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link
                href="https://www.dingocoin.com"
                target="_blank"
                rel="noreferrer"
              >
              <b>Visit Dingocoin</b>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Container>
        </Navbar>
        <header id="home" className="masthead">
        <Container>
          {/* Desktop view */}
          <div className="d-none d-lg-block">
            <div className="d-flex flex-row py-5">
              <div className="d-flex flex-column me-auto my-4">
                <h4 className="title text-center">
                  Wrap Dingocoin with SOL or BSC
                </h4>
                <h6 className="text-center">
                  Stable, Realiable & Great Exchange Rate 
                </h6>
              </div>
            </div>
           </div>
          {/* Mobile */}
          <div className="d-lg-none">
            <div className="d-flex flex-column py-5">
              <div className="d-flex flex-column me-auto mt-4 mb-auto">
                <h2 className="title text-center">
                  Wrap Dingocoin with SOL or BSC
                </h2><br />
                <h4 className="text-center">
                  Stable, Realiable & Great Exchange Rate 
                </h4>
              
              </div>
            </div>
          </div>
        </Container>
       </header>
       <section className="features">
        <Container className="py-5 mt-5">
          <FadeInSection>
            <h2 className="mb-3 text-center">wDingocoin Custodian</h2>
            <h5 className="mb-3 text-center"><strong>What Are Wrapped Coins?</strong></h5>
            <h5 className="mb-3 ">
            <p>A wrapped crypto token is a converted version of a cryptocurrency or asset that functions on a network other 
            than the original asset’s blockchain. Each wrapped token has the same value as the asset it represents and is 
            easily interchangeable.</p>
            <p>Wrapped Coins essentially represent crypto assets on non-native blockchains. These coins 
            are “wrapped” because they are inserted into a wrapper or digital vault that allows the wrapped version to operate 
            on a different blockchain.
           </p>
           </h5>
            <br />
            <h5 className="mb-3 text-center">Exchange Rate</h5>
            <br />
            <h5 className="mb-3 text-center">
            <p className="mb-0">
              1 wDingocoin = 1 Dingocoin
            </p>
            </h5>
            <br />
            <h5 className="mb-3 text-center">
            <DropdownButton
              title={
                controller === null
                  ? "Select Wrapped Network"
                  : controller === "bsc"
                  ? "Binance Smart Chain (BSC)"
                  : "Solana (SOL)"
              }
              className="mb-2"
            >
              <Dropdown.Item
                onClick={() => {
                  setController("bsc");
                }}
              >
                Binance Smart Chain (BSC)
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setController("sol");
                }}
              >
                Solana (SOL)
              </Dropdown.Item>
            </DropdownButton>
          </h5>
	      </FadeInSection>
        </Container>
      </section>  
      <section>
		<Container>
		<h5 className="mt-3 text-center">
        {controller === "bsc" && <BscController />}
      	{controller === "sol" && <SolController />}
        </h5>
        </Container>
      </section>
       <section className="section-footer text-center">
            <Row>
              <span>
                <b>© The Dingocoin Project 2021 - 2023</b> 
              </span>
            </Row>
        </section>
      </div>
      )}
    </Router>
  );
}
