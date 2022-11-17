import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { Form } from 'semantic-ui-react';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import contractAbi from './utils/contractAbi.json';
import testUSDAbi from './utils/testUSDAbi.json';

const CONTRACT_ADDRESS = "0xB576a883179d6A9018233e5833D9db8F726A764b";
const testLINK_Address = "0x1e4CF3c1eC9c799bc51101c87B145eD2dc1A0307";
const testMATIC_Address = "0x81c98576E95AF3576Ab4ccd25Bc52b5634769cE9";
const testETH_Address = "0xeD8d5e4B82d4487e3B0dF0997BD6D312A4Bfc8BC";
const testUSD_Address = "0x2C3126191A8eA852f91520D90349928fB607a49d";

const Create = () => {

    const [stipendName, setStipendName] = useState('');
    const [frequency, setFrequency] = useState();
    const [stipendAmount, setStipendAmount] = useState();
    const [initialFunds, setInitialFunds] = useState();
    const [selectedToken, setToken] = useState("testLINK");
    const [selectedTokenAddress, setTokenAddress] = useState(testLINK_Address);
    const [usdInflation, setLatestInflation] = useState('');

    const startMintToast = async () => {
        toast("Minting your " + selectedToken + "...", {
            position: "top-right",
            autoClose: 9500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        };

    const successMintToast = async () => {
        toast("Done minting!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    };

    const startCreateToast = async () => {
        toast("Setting up your CactuStipend...", {
            position: "top-right",
            autoClose: 9500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        };

    const successCreateToast = async () => {
        toast("Your new CactuStipend is ready for action!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    };

    const startApproveToast = async () => {
        toast("Processing your approval to spend your " + selectedToken + "...", {
            position: "top-right",
            autoClose: 9500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        };

    const successApproveToast = async () => {
        toast("Your tokens have been approved & you can now create a CactuStipend!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    };


    const mintTestTokens = async () => {
  
        try {
          const { ethereum } = window;

      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(selectedTokenAddress, testUSDAbi.abi, signer);
      
            console.log("Paying for gas...")
            let txn = await connectedContract.Mint("10000000000000000000000");

            startMintToast();
      
           console.log("Getting ready to mint your cactus...")
            await txn.wait();

            successMintToast();
          
            console.log(`Your tokens are minted!  See transaction: https://mumbai.polygonscan.com/tx/${txn.hash}`);
      
        } else {
            console.log("Ethereum object doesn't exist!");
        }
        } catch (error) {
          console.log(error)
      } 
      }; 


      const approveTestTokens = async () => {
  
        try {
          const { ethereum } = window;

      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(selectedTokenAddress, testUSDAbi.abi, signer);
      
            console.log("Paying for gas...")
            let txn = await connectedContract.approve(CONTRACT_ADDRESS, "1000000000000000000000000000000");

            startApproveToast();
      
           console.log("Getting ready to approve your tokens...")
            await txn.wait();

            successApproveToast();
          
            console.log(`Your tokens are approved!  See transaction: https://mumbai.polygonscan.com/tx/${txn.hash}`);
      
        } else {
            console.log("Ethereum object doesn't exist!");
        }
        } catch (error) {
          console.log(error)
      } 
      }; 

    
        
    const sendDataToContract = async () => {

    	try {
      		const { ethereum } = window;
  
      	if (ethereum) {
        	const provider = new ethers.providers.Web3Provider(ethereum);
        	const signer = provider.getSigner();
        	const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        	console.log("Paying for gas...")

            let txn = await connectedContract.createStipend(stipendName, signer.getAddress(), selectedTokenAddress, stipendAmount, frequency, initialFunds);

            startCreateToast();

  
        	console.log("Thanks for your patience.  We're setting up your 🌵 CactuStipend 🌵 now!")
        	await txn.wait();

            successCreateToast();
          
        	console.log(`Done!  See transaction: https://mumbai.polygonscan.com/tx/${txn.hash}`);
  
      	} else {
        	console.log("Ethereum object doesn't exist!");
      	}
    	} catch (error) {
      		console.log(error)
   		}
  	};

      const currentInflationPercent = async () => {
  
        try {
          const { ethereum } = window;
      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

            console.log("Checking contract data for the number of CactuStipends...")
            let latestInflation = await connectedContract.usdInflationPercent();

            setLatestInflation('' + (1 + (latestInflation / 10**18)).toFixed(3));
      
           console.log("Current inflation coming in at " + usdInflation)
      
        } else {
            console.log("Something's f*ed up...go fix it...");
        }
    
        } catch (error) {
          console.log(error)
        }
    };
    
    useEffect(() => {
        currentInflationPercent();
    }, [])   



    return (
        
        <main className="App">

        <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />      

        <header>
            <Link to="/" className="home-link">
                <div>
                    <h2>← 🌵 CactuStipend 🌵</h2>
                </div>
            </Link>
        </header>

        <div>
            <h1>Here's where you can build your own stipend.</h1>
            <h2>After you select your token, you will mint & approve it.</h2>
        </div>

        <div>
            <h2>Mint & approve your {selectedToken}.</h2>

                <button onClick={mintTestTokens} className="cta-button mint-claim-button">
						🌵 Mint 10,000 {selectedToken} 🌵
				</button>
                <button onClick={approveTestTokens} className="cta-button mint-claim-button">
						🌵 Approve {selectedToken} 🌵
				</button>
            </div>
        
        
        <div className="formContainer">

        <form>
           
            <h3 className="h3-create">What will you call your stipend?</h3>
              
                
                <input
						type="text"
                        className="name-input"
						value={stipendName}
						placeholder="Stipend Name"
						onChange={e => setStipendName(e.target.value)}
                        
					/>


            <h3 className="h3-create">Which token will you use to build your stipend?</h3>

            <div className="radio-button-container">

    <Form.Group inline>
        <Form.Radio className="radio-button" label=" testLINK" checked={selectedToken === 'testLINK'} value="testLINK" onClick={() => setToken('testLINK') & setTokenAddress(testLINK_Address)} />
        <Form.Radio className="radio-button" label=" testMATIC" checked={selectedToken === 'testMATIC'} value="testMATIC" onClick={() => setToken('testMATIC') & setTokenAddress(testMATIC_Address)} />
        <Form.Radio className="radio-button" label=" testETH" checked={selectedToken === 'testETH'} value="testETH" onClick={() => setToken('testETH') & setTokenAddress(testETH_Address)} />
        <Form.Radio className="radio-button" label=" testUSD" checked={selectedToken === 'testUSD'} value="testUSD" onClick={() => setToken('testUSD') & setTokenAddress(testUSD_Address)} />
      </Form.Group>

            </div> 

     

            <h3 className="h3-create">How often will your stipend be distributed?</h3>
            <h4>This stipend will be distributed every ____ hour(s).</h4>
            
                <input
						type="number"
                        className="number-input"
						value={frequency}
						placeholder="Distribution Frequency"
						onChange={e => setFrequency(e.target.value)}
					/>

            
            <h3 className="h3-create">How much, in US dollars, will be distributed each time?</h3>
            <h4>This amount will be modified by the Truflation USD YoY Inflation Oracle.</h4>
            <h4>Current modifier: x{usdInflation}</h4>
                
                <input
						type="number"
                        className="number-input"
						value={stipendAmount}
						placeholder="$ Amount"
						onChange={e => setStipendAmount(e.target.value)}
					/>


            <h3 className="h3-create">How many {selectedToken} tokens will you provide for initial funding?</h3>
                
                    <input
						type="number"
                        className="number-input"
						value={initialFunds}
						placeholder={selectedToken}
						onChange={e => setInitialFunds(e.target.value)}
					/> 
                
            </form>

            <button className='create' onClick={sendDataToContract}>
                🌵 Create CactuStipend 🌵 </button>


        </div>


    </main>
    
    
    );
};

export default Create;
