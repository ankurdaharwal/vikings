// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const main = async () => {
  const gameContractFactory = await ethers.getContractFactory("Vikings");
  const gameContract = await gameContractFactory.deploy(
    [
      "Ragnar",
      "Kvasir",
      "Orvar",
      "Astrid",
      "Vidar",
      "Skadi",
      "Hreidmar",
      "Njord",
      "Sigrun",
      "Tyr",
    ], // Names
    [
      "Warrior",
      "Mage",
      "Raider",
      "Shield Maiden",
      "Demigod",
      "Warrior",
      "Mage",
      "Raider",
      "Shield Maiden",
      "Demigod",
    ], // Class
    [
      "https://gateway.pinata.cloud/ipfs/QmamB3UngboAGVbdh2Xye33wJFoKEc18M89miuGi7bEpLa",
      "https://gateway.pinata.cloud/ipfs/QmWLdYJJXMcqDrgZ5oQkPU4u3dcbsPA95xHMU6uzXo3oai",
      "https://gateway.pinata.cloud/ipfs/QmR47fS5Uvqu9WzhApFSt5ZAby4mYM4T4rv52hVCvQp2D3",
      "https://gateway.pinata.cloud/ipfs/Qmd8SbaRpuybBuaWMvrg5RdcV3fj4pfTds2vSMnpswV17b",
      "https://gateway.pinata.cloud/ipfs/QmQSCa7mH15hWm8svN3ARqPPBeGBuahU7tQHc5pLz498qu",
      "https://gateway.pinata.cloud/ipfs/QmQLCY7eSoBbQVeJW4jxyeGMGHEYvwGLQdvSF8iaZM12qt",
      "https://gateway.pinata.cloud/ipfs/QmdZVhtDYQ885mK7oeuXWCQbXoZaZWdMhQtC4jHRhYs1pB",
      "https://gateway.pinata.cloud/ipfs/QmXmtiVtBQHaqJ7WrppLcccdhF2YuiQ3dZkRsRvMch1DU5",
      "https://gateway.pinata.cloud/ipfs/QmahResLJpq5Rs6byKkVC1Cuf3pdrCaXmjApGH98v11w9b",
      "https://gateway.pinata.cloud/ipfs/Qmcf6bJSFpDJ3qtPQpJMRtUDG82YXUEUdPEACgPEo4QtRP",
    ],
    [500, 300, 350, 450, 600, 450, 250, 400, 500, 650], // HP values
    [90, 150, 120, 100, 75, 95, 160, 110, 85, 70], // Attack damage values
    "Drakon", // Boss name
    "https://gateway.pinata.cloud/ipfs/QmeyEFasFs6qcB9CuRiALKWj2PrYfnfT5t3VboYJymjia4", // Boss image
    10000, // Boss hp
    150 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  let returnedTokenUri;

  txn = await gameContract.mintVikingNFT(0);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Minted Viking NFT #1\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(1);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(2);
  console.log("Minted Viking NFT #2\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(2);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(3);
  console.log("Minted Viking NFT #3\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(3);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(4);
  console.log("Minted Viking NFT #4\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(4);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(5);
  console.log("Minted Viking NFT #5\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(5);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(6);
  console.log("Minted Viking NFT #6\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(6);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(7);
  console.log("Minted Viking NFT #7\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(7);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(8);
  console.log("Minted Viking NFT #8\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(8);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(9);
  console.log("Minted Viking NFT #9\nURI:", returnedTokenUri);

  txn = await gameContract.mintVikingNFT(9);
  await txn.wait();

  returnedTokenUri = await gameContract.tokenURI(10);
  console.log("Minted Viking NFT #10\nURI:", returnedTokenUri);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
