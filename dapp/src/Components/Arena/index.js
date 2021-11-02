import React, { useEffect, useState } from 'react';
import Sound from 'react-sound';
import { ethers } from 'ethers';

import SelectSound from '../../assets/select_hover.wav';
import AttackSound from '../../assets/dragon.wav';

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
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  
  const runAttackAction = async () => {
    try {
      if (gameContract) {
          setIsAttacking(true);
          setAttackState('attacking');
          console.log('Attacking boss...');
          const attackTxn = await gameContract.attackBoss();
          await attackTxn.wait();
          console.log('attackTxn:', attackTxn);
          setAttackState('hit');
          setIsAttacking(false);
      }
    } catch (error) {
        console.error('Error attacking boss:', error);
        setIsAttacking(false);
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
          <button 
            onMouseEnter={() => setIsSelecting(true)}
            onMouseLeave={() => setIsSelecting(false)}
            onClick={() => { runAttackAction()}}
          >
            <img
              src={`https://ipfs.io/ipfs/QmPERvbAWHKSVXdNxreYj1drSYr7b88N3Afy8ETQEQXz8S`}
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
                <p className="stats">Attacking ⚔️</p>
          )}
          </span>
        </div>
      )}
    </div>
    <Sound
      url={SelectSound}
      playStatus={isSelecting ? Sound.status.PLAYING : Sound.status.STOPPED}
      volume={100}
    />
    <Sound
      url={AttackSound}
      playStatus={isAttacking ? Sound.status.PLAYING : Sound.status.STOPPED}
      volume={100}
    />
    </>
  );
};

export default Arena;