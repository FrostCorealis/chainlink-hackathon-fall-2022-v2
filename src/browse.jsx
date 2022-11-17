import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ethers } from 'ethers';
import contractAbi from './utils/contractAbi.json';
import ZKPcontractAbi from './utils/ZKPcontractAbi.json';
import './App.css';

const CONTRACT_ADDRESS = "0xB576a883179d6A9018233e5833D9db8F726A764b";
const ZKPPOLYGONID_ADDRESS = "0x3A7772B5e1407524B6D57aaDAD226B4Ed56abFA7"; 

const Browse = () => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [totalStipends, setTotalStipends] = useState(0);
    const [stipendList, setStipendList] = useState([]);
    const [ joinNumber, setJoinNumber] = useState ('');

    const showToast = async () => {
        toast("Adding you to the list for CactuStipend " + joinNumber + "...", {
            position: "top-right",
            autoClose: 9500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        };

    const successToast = async () => {
        toast("Your're in!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    };
    
    const alreadyJoinedToast = async () => {
        toast.warn("You already joined this CactuStipend.", {
            position: "top-right",
            autoClose: 5700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    };

          
    
    const numberOfStipends = async () => {
  
        try {
          const { ethereum } = window;
      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, provider);

            console.log("Checking contract data for the number of CactuStipends...")
            let stipendIterator = await connectedContract.getNumberofStipends();
      
           console.log("Waiting for the data to arrive...")

            console.log(`There are currently ${stipendIterator -= 1} stipends.`);
            console.log(stipendIterator -= 1) ;


            setTotalStipends(stipendIterator -= 1) ;
                      
            console.log(`There are currently ${totalStipends} and also ${stipendIterator}`);
      
        } else {
            console.log("Something's f*ed up...go fix it...");
        }
    
        } catch (error) {
          console.log(error)
        }
    }; 


    const fetchStipendStats = async () => {
  
        try {
          const { ethereum } = window;
          
      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
  
                console.log("Grabbing the contract data for the all the existing CactuStipends...")

            const stipends = await connectedContract.getAllStipends();
        
                console.log("Waiting for the array to arrive...")
             
                console.log(`Here's the scoop on all the current CactuStipends: ${stipends}   🏗 Now go build the render method! 🌵✨`);


                const stipendsCreated = await Promise.all(stipends.map(async (stipend, index) => {
                return {
                        stipendId: ('' + stipend[2]),
                        stipendName: stipend[0],
                        stipendToken: stipend[11],
                        paymentAmount: ('' + stipend[4]),
                        paymentInterval: ('' + stipend[5]),
                    };
                }));
                setStipendList(stipendsCreated);
                console.log ({stipendsCreated});
                console.log("+ the state:", stipendList)

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
                <h1 className="subtitle">Browse the available stipends.</h1>
                <div className = "stipend-list">
                <div className="zkp-stipend-stats">
                <p className="stipend-name">{' '}ZKP Stipend{' '}</p>
                <p>Pays 9999 zkDoubloons every hour.</p>
                <p>Requirement: PolygonID</p>
                <div className="zkp-id-box">      
                <p className="id-name">🌵 Stipend ID:{' '}{0}{' '}🌵</p>
                </div>
                </div>
                    { stipendList.map((stipend, index) => {
                                              
                        return (
                            <div className="stipend-stats" key={stipend}>
                            <div className="stipend-row">
                                    
                                            <p className="stipend-name">{' '}{stipend.stipendName}{' '}</p>
                            </div>      
                                        <p>Pays ${stipend.paymentAmount} of {stipend.stipendToken} every {stipend.paymentInterval} hours.</p>
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

   
       


    const joinStipend = async () => {
         
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
            if (joinNumber == 0) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(ZKPPOLYGONID_ADDRESS, ZKPcontractAbi.abi, signer);
            
            console.log("Paying for gas...")

            


            let txn = await connectedContract.userJoinStipend(1, signer.getAddress());
            showToast();
            console.log(`Getting you on the CactuStipend list for CactuStipend ${joinNumber}...`)
            await txn.wait();
          
            console.log(`You're in!`);

            successToast();
                
            }

            else {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
    
            console.log("Paying for gas...")
            let txn = await connectedContract.userJoinStipend(joinNumber, signer.getAddress());
            showToast();
            console.log(`Getting you on the CactuStipend list for CactuStipend ${joinNumber}...`)
            await txn.wait();
            successToast();
          
            console.log(`You're in!`);
            }

          } else {
            console.log("Something's f*ed up in the join(random)Stipend function...");
          }
        } catch (error) {
              console.log(error)
            alreadyJoinedToast();
           }
      };


      const renderJoinButton = () => (
    
            <div className="join-input-container">

            <h2>Which stipend would you like to join?</h2>
            <title>Enter the stipend ID:</title>
            
            <input
                    type="number"
                    className="stipend-id-input"
                    value={joinNumber}
                    min="1" 
                    max={totalStipends}
                    placeholder="Stipend ID"
                    onChange={e => setJoinNumber(e.target.value)}
                />
                
                <button className="cta-button mint-claim-button" onClick={joinStipend}>
                    🌵 Join a CactuStipend 🌵 
                </button>
    
            </div>
        );
        


    useEffect(() => {
        numberOfStipends();
    }, [])


    useEffect(() => {
        fetchStipendStats();
    }, [])



    return (
        
        <main className="App">

        <ToastContainer
            position="top-left"
            autoClose={8000}
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
                <h1 className="subtitle">Here's where you can see all the available stipends and select one to join.</h1>
                <h2>Make your selection, enter the stipend ID, and then click join.</h2>
                <h3>After you join a stipend, visit the Manage page to check your balance.</h3>
            </div>

        <div>
            <hr className="hr-green-line" />  
        </div>

        

    {renderJoinButton()}



        <div>
            <hr className="hr-green-line" />  
        </div>  

    <div>
        {renderStipends()}
    </div>

   
</main>
        
    )
};

export default Browse;
