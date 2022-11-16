import React, { useState } from "react";
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
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


    const mintTestUSD = async () => {
  
        try {
          const { ethereum } = window;

      
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(testUSD_Address, testUSDAbi.abi, signer);
      
            console.log("Paying for gas...")
            let txn = await connectedContract.Mint("10000000000000000000000");
      
           console.log("Getting ready to mint your cactus...")
            await txn.wait();
          
            console.log(`Your tokens are minted!  See transaction: https://mumbai.polygonscan.com/tx/${txn.hash}`);
      
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

  
        	console.log("Thanks for your patience.  We're setting up your 🌵 CactuStipend 🌵 now!")
        	await txn.wait();
          
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

        <header>
            <Link to="/" className="home-link">
                <div>
                    <h2>🌵 CactuStipend 🌵</h2>
                </div>
            </Link>
        </header>

        <div>
            <h1>Here's where you can build your own stipend.</h1>
            <h2>First, you'll need some TestUSD.</h2>
                <button onClick={mintTestUSD} className="cta-button mint-claim-button">
						🌵 Mint 10,000 TestUSD 🌵
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
