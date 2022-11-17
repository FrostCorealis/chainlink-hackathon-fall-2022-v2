import React, { useState } from "react";
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import contractAbi from './utils/contractAbi.json';
import testUSDAbi from './utils/testUSDAbi.json';


const CONTRACT_ADDRESS = "0x6f71F58a56FBF14b7229028F11fcC16e0f97226f";
const testUSD_Address = "0x2C3126191A8eA852f91520D90349928fB607a49d";

const Create = () => {

    const [stipendName, setStipendName] = useState('');
    const [frequency, setFrequency] = useState();
    const [stipendAmount, setStipendAmount] = useState();
    const [initialFunds, setInitialFunds] = useState();

    const startMintToast = async () => {
        toast("Minting your TestUSD...", {
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
        toast("Done!", {
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
        toast("Processing your approval to spend your TestUSD...", {
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
        toast("Your TestUSD is approved & you can now create a CactuStipend!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });

    };


    const mintTestUSD = async () => {
  
        try {
          const { ethereum } = window;

      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(testUSD_Address, testUSDAbi.abi, signer);
      
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


      const approveTestUSD = async () => {
  
        try {
          const { ethereum } = window;

      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(testUSD_Address, testUSDAbi.abi, signer);
      
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

            let txn = await connectedContract.createStipend(stipendName, signer.getAddress(), testUSD_Address, stipendAmount, frequency, initialFunds);

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
                    <h2>🌵 CactuStipend 🌵</h2>
                </div>
            </Link>
        </header>

        <div>
            <h1>Here's where you can build your own stipend.</h1>
            <h2>First, you'll need to mint & approve TestUSD.</h2>
                <button onClick={mintTestUSD} className="cta-button mint-claim-button">
						🌵 Mint 10,000 TestUSD 🌵
				</button>
                <button onClick={approveTestUSD} className="cta-button mint-claim-button">
						🌵 Approve TestUSD 🌵
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


            <h3 className="h3-create">How often will your stipend be distributed?</h3>
            <h4>This stipend will be distributed every ____ day(s).</h4>
            
                <input
						type="number"
                        className="number-input"
						value={frequency}
						placeholder="Distribution Frequency"
						onChange={e => setFrequency(e.target.value)}
					/>


            <h3 className="h3-create">How many tokens will be distributed each time?</h3>
                
                <input
						type="number"
                        className="number-input"
						value={stipendAmount}
						placeholder="Distribution Amount"
						onChange={e => setStipendAmount(e.target.value)}
					/>


            <h3 className="h3-create">How much are you providing for the inital funding for this stipend?</h3>
                
                <input
						type="number"
                        className="number-input"
						value={initialFunds}
						placeholder="Initial Funding"
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
