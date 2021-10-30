import React, { useEffect, useState } from 'react';

import Sound from 'react-sound';
import Valhalla from './assets/valhalla.mp3'

import { ethers } from 'ethers';
import './App.css';

// Components
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

import metaVikings from './utils/Vikings.json';

// Constants
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';

const App = () => {

// State
const [currentAccount, setCurrentAccount] = useState(null);
const [characterNFT, setCharacterNFT] = useState(null);
const [metaMaskMsg, setMetaMaskMsg] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [isPlaying, setIsPlaying] = useState(true);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        setIsLoading(false);
        setMetaMaskMsg(true);
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        setIsLoading(false);
        console.log('No authorized account found');
      }

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      handleChainChanged(chainId);

      ethereum.on('chainChanged', handleChainChanged);

      function handleChainChanged(_chainId) {
        if(_chainId != '0x4'){
          alert('Please select Rinkeby (Ethereum Testnet) Network on MetaMask!');
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Download Metamask Chrome Extension!");
        window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
const renderContent = () => {

  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  /*
   * Scenario #1
   */
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          CONNECT WALLET TO PLAY
        </button>
      </div>
    );
    /*
     * Scenario #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT} />;
  }
};

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  /*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      metaVikings.abi,
      signer
    );

    const userNFT = await gameContract.checkIfUserHasNFT();
    if (userNFT?.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(userNFT));
      setIsLoading(false);
    };

  if (characterNFT?.name) {
    console.log('User has character NFT');
    setCharacterNFT(transformCharacterData(characterNFT));
  } else {
    console.log('No character NFT found!');
  }
};

  /*
   * We only want to run this, if we have a connected wallet
   */
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
    setIsLoading(false);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentAccount]);

  return (
    <div className="App">
      <div className="container">      
        <div className="sound-box">
          <div className="sound-toggle" 
            onClick={() => setIsPlaying(!isPlaying ? true : false)}>
              {isPlaying ? '🔊' : '🔇'}
          </div>
        </div>
        <div className="error">{metaMaskMsg ? 'You need MetaMask to play!' : ''}</div>
        <div className="header glow-text gradient-text">Vikings
          <p className="sub-text">Fight For Valhalla</p>
        </div>
        {/* 🪓⚔️🛡️🗡️🏹 */}
        {renderContent()}
      </div>
      <Sound
        url={Valhalla}
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
        volume={20}
        loop
      />
      <div className="footer-container">
        <div className="footer-text"></div>
        &copy; 2021 Vikings Created with 🔥 by <b>An1cu12</b>
      </div>
    </div>
  );
};

export default App;