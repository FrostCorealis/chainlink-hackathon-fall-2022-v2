import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'tippy.js/themes/light-border.css';
import 'onfido-sdk-ui/dist/style.css';
import { ethers } from 'ethers';
import contractAbi from './utils/contractAbi.json';
import ZKPcontractAbi from './utils/ZKPcontractAbi.json';
import './App.css';

const CONTRACT_ADDRESS = "0x6f71F58a56FBF14b7229028F11fcC16e0f97226f";
const ZKPPOLYGONID_ADDRESS = "0x3A7772B5e1407524B6D57aaDAD226B4Ed56abFA7"; 

const Manage = () => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');

    const [totalStipends, setTotalStipends] = useState(0);
    const [stipendList, setStipendList] = useState([]);
    const [zkpStatus, setZKPStatus] = useState([]);
    const [ claimNumber, setClaimNumber] = useState ('');
	
	
    const startClaimToast = async () => {
         toast("Claiming your CactuStipend balance...", {
         position: "top-right",
         autoClose: 9500,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
            });
    };

    const successClaimToast = async () => {
        toast("Done! Your balance includes the Truflation adjustment to match the current rate of inflation.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    };	
	
    const startZKPClaimToast = async () => {
         toast("Claiming your Truflation-adjusted balance from your ZPK CactuStipend ...", {
         position: "top-right",
         autoClose: 9500,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         });
    };

    const successZKPClaimToast = async () => {
        toast("Done! You've got ZPK Dubloons!  Check your wallet. 😎", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    };	
	

      

    const fetchStipendStats = async () => {
  
        try {
          const { ethereum } = window;
          
      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
  
                console.log("Grabbing the contract data for the all the existing CactuStipends...")

            const stipends = await connectedContract.getUserJoinedStipends(signer.getAddress());
        
                console.log("Waiting for the array to arrive...")
             
                console.log(`Here's the scoop on all the current CactuStipends: ${stipends}   🏗 Now go build the render method! 🌵✨`);

           

                const stipendsJoined = await Promise.all(stipends.map(async (stipend, index) => {
                return {
                        stipendId: ('' + stipend[2]),
                        stipendName: stipend[0],
                        stipendToken: stipend[1],
                        pendingBalance: ('' + (stipend[5] / 10**18).toFixed(2)),
                        paymentAmount: ('' + stipend[3]),
                        paymentInterval: ('' + stipend[4]),
                    };
                }));

                setStipendList(stipendsJoined);
                console.log ({stipendsJoined});
                console.log("+ the state:", stipendList)

            }
        } catch(error){
            console.log(error);
        }
    };

    const fetchZKPStatus = async () => {
  
        try {
          const { ethereum } = window;
          
      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(ZKPPOLYGONID_ADDRESS, ZKPcontractAbi.abi, signer);
  
                console.log("Grabbing the contract data for the ZKP CactuStipend...")

            const stipends = await connectedContract.getUserJoinedStipends(signer.getAddress());
        
                console.log("Checking to see if you're in the ZKP stipend...")
             
                console.log(`Here are the numbers of the CactuStipends to which you belong: ${stipends} 🌵✨`);


                const stipendsJoined = await Promise.all(stipends.map(async (stipend, index) => {
                return {
                        stipendId: ('' + 0),
                        stipendName: "ZKP Stipend",
                        stipendToken: stipend[1],
                        pendingBalance: ('' + (stipend[5] / 10**18).toFixed(2)),
                        paymentAmount: ('' + stipend[3]),
                        paymentInterval: ('' + stipend[4]),
                    };
                }));
                setZKPStatus(stipendsJoined);
                console.log ({stipendsJoined});
                console.log("+ the state:", zkpStatus)

            }
        } catch(error){
            console.log(error);
        }
    };


    const renderStipends = () => {
        if (stipendList.length > 0) {
        console.log("WORK WORK");
        console.log("testing the state:", stipendList)
    
        return (
            <div className="stipend-container">
                <h1 className="subtitle">Browse your stipends.</h1>
                <div className="stipend-list">
                 
                {renderZKPStipend()}
                    { stipendList.map((stipend, index) => {
                                              
                        return (
                            <div className="stipend-stats" key={stipend}>
                            <div className="stipend-row">
                                    
                                <p className="stipend-name">{' '}{stipend.stipendName}{' '}</p>
                            </div>      
                                <p>Pending Balance:{' '}{stipend.pendingBalance}{' '}{stipend.stipendToken}{' '}</p>
                                <p>Pays ${stipend.paymentAmount} of {stipend.stipendToken} every {stipend.paymentInterval} days.</p>
                                
                                <div className="id-box">      
                                    <p className="id-name">🌵 Stipend ID:{' '}{stipend.stipendId}{' '}🌵</p>
                                </div>
                                                 
                            </div>
                            
                        )
                })}
            </div>
        </div>);
        }
    };


    const renderZKPStipend = () => {
        if (zkpStatus.length > 0) {
        console.log("GO ZPK GO ZPK GO ZPK");
		
        console.log("Your ZPK status is:", zkpStatus)
    
        return (
            <div className="stipend-container">
                <div className="stipend-list">
                    
    
                    { zkpStatus.map((stipend, index) => {
                                              
                        return (
                            <div className="zkp-stipend-stats" key={stipend}>
                            <div className="stipend-row">
                                    
                                            <p className="stipend-name">{' '}{stipend.stipendName}{' '}</p>
                            </div>      
                                        <p>Pending Balance:{' '}{stipend.pendingBalance}{' '}zkDoubloons{' '}</p>
                                        <p>Pays 9999 zkDoubloons every hour.</p>
                                        <div className="zkp-id-box">      
                                        <p className="id-name">🌵 Stipend ID:{' '}{stipend.stipendId}{' '}🌵</p>
                                        </div>
                                                 
                            </div>
                            
                        )
                })}
            </div>
        </div>);
        }
    };


    const claimStipend = async () => {
         
        try {
              const { ethereum } = window;
    
            const accounts = await ethereum.request({ method: 'eth_accounts' });
    
              if (accounts.length !== 0) {
                  const account = accounts[0];
                  console.log('Found an authorized account:', account);
                  setCurrentAccount(account);
              } else {
                  console.log('No authorized account found');
            }
    
          if (ethereum) {
            if (claimNumber == 0) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(ZKPPOLYGONID_ADDRESS, ZKPcontractAbi.abi, signer);
                
                console.log("Paying for gas...")
                let txn = await connectedContract.userClaimStipend(1, signer.getAddress());
		    
		    startZKPClaimToast();
        
                console.log(`Claiming your balance from your ZPK CactuStipend ${claimNumber}...`)
                await txn.wait();
		    
		    successZKPClaimToast();
              
                console.log(`You've got ZPK Dubloons!  Check your wallet. 😎`);
                }
		  
            else {
		    
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
    
            console.log("Paying for gas...")
            let txn = await connectedContract.userClaimStipend(claimNumber, signer.getAddress());
		    
		    startClaimToast();
    
            console.log(`Claiming your balance from your CactuStipend ${claimNumber}...`)
            await txn.wait();
		    
		    successClaimToast();
          
            console.log(`You've got funds! Check your wallet. 💵`);

            window.location.reload()

        }
        } else {
        console.log("Something's broken in the claimStipend function...");
        }
        } catch (error) {
            console.log(error)
        }
           
      };


      const renderClaimButton = () => (
    
            <div className="join-input-container">

            <h2>Which stipend would you like to claim from?</h2>
            <title>Enter the stipend ID:</title>
            
            <input
                    type="number"
                    className="stipend-id-input"
                    value={claimNumber}
                    min="1" 
                    max={totalStipends}
                    placeholder="Stipend ID"
                    onChange={e => setClaimNumber(e.target.value)}
                />
                

                <button className="cta-button mint-claim-button" onClick={claimStipend}>
                    🌵 Claim Your CactuStipend 🌵 
                </button>
    
            </div>
        );
        

    useEffect(() => {
        fetchZKPStatus();
    }, [])


    useEffect(() => {
        fetchStipendStats();
    }, [])    


    return (
        
        <main className="App">
	    
	<ToastContainer
            position="top-right"
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
            <h1>Here's where you can check & claim your stipend balances.</h1>
            <h2>Make your selection, enter the stipend ID, and then click claim.</h2>
        </div>

        
        <div>
            <hr className="hr-green-line" />  
        </div>

        

            {renderClaimButton()}



        <div>
            <hr className="hr-green-line" />  
        </div>  



        <div>
            {renderStipends()}
        </div>

        
            </main>
        
    )

};

export default Manage;
