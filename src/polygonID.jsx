import React from "react";
import { render } from "react-dom";
import { QRCode } from "react-qr-svg";
import polygonLogo from './assets/polygonlogo.png';

import { Link } from 'react-router-dom';  // managed links differently here because of the different react structure

const styles = {
  root: {
    color: "#000000",
    topMargin: "0",
  },
  zpkContainer: {
    color: "#FFFFFF",
    fontFamily: "sans-serif",
    textAlign: "center",
    background: "#000000",
    height: "120vh",
    marginTop: "50px",
  },
  title: {
    color: "#8247E5",
    textStyle: "bold",
    textShadow: "1px 1px 2px #9ACD32, 2px 2px 25px white, 3px 3px 5px #d9c7f7",
    fontSize: "35px",
  },
  titleContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  qrbox: {
    background: "#FFFFFF",
    margin: "35px",
    width: "fit-content",
    margin: "auto",
  },
  qrcontainer: {
    maxWidth: "520px",
    background: "#FFFFFF",
    borderStyle: "solid",
    borderWidth: "17px",
    borderColor: "#8247E5",
    margin: "auto",
    marginBottom: "85px",
    marginTop: "50px",
    padding: "30px",
    boxShadow: "3px 3px 29px #d9c7f7, 5px 5px 25px #9ACD32",
  },

};

// update with your contract address
const deployedContractAddress = "0x3A7772B5e1407524B6D57aaDAD226B4Ed56abFA7";

// more info on query based requests: https://0xpolygonid.github.io/tutorials/wallet/proof-generation/types-of-auth-requests-and-proofs/#query-based-request
const qrProofRequestJson = {
  id: "f4c0d699-ddf6-44bd-807f-30ae81962039",
  typ: "application/iden3comm-plain-json",
  type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
  body: {
    transaction_data: {
      contract_address: "0x3A7772B5e1407524B6D57aaDAD226B4Ed56abFA7",
      method_id: "b68967e2",
      chain_id: 80001,
      network: "polygon-mumbai"
    },
    reason: "chainlink hackathon stipend",
    scope: [
      {
        id: 1,
        circuit_id: "credentialAtomicQuerySig",
        rules: {
          query: {
            allowed_issuers: ["*"],
            req: {
              hackathonparticipant: {
                $eq: 1
              }
            },
            schema: {
              url:
                "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/de3875eb-a779-4cd6-8966-c75d1250c289.json-ld",
              type: "ChainlinkHackathonFall2022Cactus"
            }
          }
        }
      }
    ]
  }
};

export default class App extends React.Component {
  componentDidMount() {}

  render() {
    return (           

      <div style={styles.zpkContainer}>
        <div style={styles.titleContainer}>
        <img src={polygonLogo} className="poly-logo" alt="logo" />
        <h1 style={styles.title}>
        {" "}Join the ZKP Stipend on CactuStipend{" "}
        </h1>
        <img src={polygonLogo} className="poly-logo" alt="logo" />
        </div>
  
        <h2>First, {" "}
          <a
            href="https://platform-test.polygonid.com/claim-link/f4c0d699-ddf6-44bd-807f-30ae81962039"
            target="_blank">{" "}click here to obtain verification credentials</a>.</h2>
              
          <h2>Next, scan the QR code below to gain access to the ZKP Stipend.</h2>
        <h2>After that,navigate back to Browse to join the ZKP Stipend.</h2>

        <div style={styles.qrcontainer}>
            <div style={styles.qrbox}>
                <QRCode
                    level="Q"
                    style={{ width: 512 }}
                    value={JSON.stringify(qrProofRequestJson)}
                />
            </div>
        </div>
        <h1>
          <a href="https://hackacactus.vercel.app/">
          ← return to {" "}🌵 CactuStipend 🌵
          </a></h1>
       
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
