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
                href="https://www.dingocoin.org"
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
            <p>A wrapped Dingocoin (wdingocoin) is a type of ERC-20 token on a Smart Contract chain such as the Ethereum, Binance Smart Chain, Polygon, Solana, or others, that 
		represents the value of one DingoCoin. </p>

            <p>1 Dingocoin = 1 wDingoCoin. The process of creating wDingocoin involves taking actual DingoCoin and "wrapping" it in a smart contract, allowing it to be used as a 
	    	token within the chosen Smart Contract network.</p>

	    <p>By wrapping Dingocoin in this way, the liquidity and stability of DingoCoin is brought to the Ethereum, BSC, Polygon, Solana, or other ecosystem, providing a 
	       bridge between the two networks. The result is a digital asset that can be easily traded, used to pay for goods and services, and accessed within the decentralised 
	       applications built on the Smart Contract platform.With wDingocoin, users can take advantage of the best of both networks, leveraging the stability of  DingoCoin and the versatility of today's Smart Contract platforms.</p>
           <p>Please note: We have heard about a similarly named token (Dingo Token) that some have mistaken for us! They are not us. They are a scam! <br>
              Our Official Coin and Token are 
	      DingoCoin and wDingocoin, suffixed as wDingocoin-BSC for the wrapped Dingocoin on the Binance Smart Chain, or wDingocoin-SOL on the Solana blockchain. Others are planned 
	      or in development, but always check the validity of any token, and make sure you are dealing with a genuine Dingocoin token.</p>	
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
                <b>© The Dingocoin Project 2021 - 2022</b> 
              </span>
            </Row>
        </section>
      </div>
      )}
    </Router>
  );
}
