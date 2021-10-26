import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';

import LoadingIndicator from '../LoadingIndicator';

import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import metaVikings from '../../utils/Vikings.json';

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  const [mintingCharacter, setMintingCharacter] = useState(false);

  // UseEffect
  useEffect(() => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      metaVikings.abi,
      signer
    );

    /*
     * This is the big difference. Set our gameContract in state.
     */
    setGameContract(gameContract);
  } else {
    console.log('Ethereum object not found');
  }
}, []);

  // Actions
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        setMintingCharacter(true);
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintVikingNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
      setMintingCharacter(false);
    }
  };

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
  
        const charactersTxn = await gameContract.getAllDefaultVikings();
        console.log('charactersTxn:', charactersTxn);
  
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );
  
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };
  
    /*
     * Add a callback method that will fire when this event is received
     */
    const onCharacterMint = async (sender, tokenId, vikingIndex) => {
      console.log(
        `VikingNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} vikingIndex: ${vikingIndex.toNumber()}`
      );
  
      /*
       * Once our character NFT is minted we can fetch the metadata from our contract
       * and set it in state to move onto the Arena
       */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };
  
    if (gameContract) {
      getCharacters();
  
      /*
       * Setup NFT Minted Listener
       */
      gameContract.on('VikingNFTMinted', onCharacterMint);
    }
  
    return () => {
      /*
       * When your component unmounts, let;s make sure to clean up this listener
       */
      if (gameContract) {
        gameContract.off('VikingNFTMinted', onCharacterMint);
      }
    };
  }, [setCharacterNFT, gameContract]);

  const getClassEmoji = (className) => {
    switch (className) {
      case "Warrior": return "🗡️🦹🏻";
      case "Mage": return "🧙🏻‍♂️";
      case "Raider": return "🪓🦹🏻";
      case "Shield Maiden": return "🛡️🧝🏻‍♀️";
      case "Demigod": return "🧜🏻‍♂️";
      default: return "";
    }
  }

  // Render Methods
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div 
        className="character-item"
        key={character.name}
        onClick={mintCharacterNFTAction(index)}
      >
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <div
          className="character-mint-button"
        >
          <div className="character-mint-button-text">
            <p>Class: {character.class} {getClassEmoji(character.class)}</p>
            <p>HP: {character.hp} 🩸  ATK: {character.attackDamage} ⚔️</p>
          </div>
        </div>
      </div>
    ));

    return (
      <>
        <div className="select-title">Choose your Viking!</div>
        <div className="select-character-container">
          {characters.length > 0 && (
            <div className="character-grid">{renderCharacters()}</div>
          )}
          {/* Only show our loading state if mintingCharacter is true */}
          {mintingCharacter && (
            <div className="loading">
              <div className="indicator">
                <LoadingIndicator />
                <p>Minting In Progress...</p>
              </div>
            </div>
          )}
        </div>
      </>
    );
};
export default SelectCharacter;