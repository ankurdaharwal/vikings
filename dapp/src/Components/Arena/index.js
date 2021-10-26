import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import LoadingIndicator from '../LoadingIndicator';

import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import Vikings from '../../utils/Vikings.json';
import './Arena.css';

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  /*
   * State that will hold our boss metadata
   */
  const [boss, setBoss] = useState(null);

  const [attackState, setAttackState] = useState('');
  
  const runAttackAction = async () => {
    try {
      if (gameContract) {
          setAttackState('attacking');
          console.log('Attacking boss...');
          const attackTxn = await gameContract.attackBoss();
          await attackTxn.wait();
          console.log('attackTxn:', attackTxn);
          setAttackState('hit');
      }
    } catch (error) {
        console.error('Error attacking boss:', error);
        setAttackState('');
    }
  };

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Vikings.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);
  
  useEffect(() => {
  /*
   * Setup async function that will get the boss from our contract and sets in state
   */
  const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
  };
  if (gameContract) {
    /*
     * gameContract is ready to go! Let's fetch our boss
     */
    fetchBoss();
  }
}, [gameContract]);

return (
  <>
    <div className="arena-title">Attack ${boss?.name}!</div>
    <div className="arena-container">
      {characterNFT && boss && (
        <div className="players-container">
          <span className="player">
            <div className="health-bar">
            <h2 className="character-name">{characterNFT.name}</h2>
              <progress value={characterNFT.hp} max={characterNFT.maxHp} />
              <p className="progress-bar-text">{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
            </div>
            <div className="image-content">
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
            </div>
          <div className="stats">
            <div>{`⚔️ Attack Damage: `}<span>{characterNFT.attackDamage}</span></div>
          </div>
        </span>
        <span className="attack-container">
          <button onClick={() => { runAttackAction()}}>
            <img
              src={`https://gateway.pinata.cloud/ipfs/QmPERvbAWHKSVXdNxreYj1drSYr7b88N3Afy8ETQEQXz8S`}
              alt={`Axe`}
              height={160}
              width={140}
            />
          </button>
        </span>
        <span className="boss-container">
          {/* Add attackState to the className! After all, it's just class names */}
          <div className={`boss-content ${attackState}`}>
            <h2 className="character-name">{boss?.name}</h2>
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss?.name}`} />
            </div>
          </div>
          {attackState === 'attacking' && (
            <div className="loading-indicator">
                <LoadingIndicator />
                <p>Attacking ⚔️</p>
            </div>
          )}
          </span>
        </div>
      )}
    </div>
    </>
  );
};

export default Arena;