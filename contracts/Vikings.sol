/**
 *  Author  : Ankur Daharwal (@ankurdaharwal)
 *  Project : Vikings
 *  Tags    : GameFi, NFT, Metaverse, Gaming
 *  File    : Vikings.sol
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";

// Hardhat util for console output
import "hardhat/console.sol";

// Vikings inherits from a standard ERC721 NFT contract
contract Vikings is ERC721 {
  // viking attributes struct
  struct VikingAttributes {
    uint256 vikingIndex;
    string name;
    string class;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  struct BigBoss {
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  // Contract events.
  event VikingNFTMinted(address sender, uint256 tokenId, uint256 vikingIndex);
  event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

  BigBoss public bigBoss;

  // The tokenId is the NFTs unique identifier, it's just a number that goes
  // 0, 1, 2, 3, etc.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // Vikings struct array.
  VikingAttributes[] defaultVikings;

  // We create a mapping from the nft's tokenId => Viking's attributes.
  mapping(uint256 => VikingAttributes) public nftHolderAttributes;

  // A mapping from an address => the NFTs tokenId.
  // NFT token holder register for future reference.
  mapping(address => uint256) public nftHolders;

  constructor(
    string[] memory vikingNames,
    string[] memory classes,
    string[] memory vikingImageURIs,
    uint256[] memory vikingHp,
    uint256[] memory vikingAttackDmg,
    string memory bossName, // These new variables would be passed in via run.js or deploy.js.
    string memory bossImageURI,
    uint256 bossHp,
    uint256 bossAttackDamage
  ) ERC721("Vikings", "viking") {
    // Initialize the boss. Save it to our global "bigBoss" state variable.
    bigBoss = BigBoss({
      name: bossName,
      imageURI: bossImageURI,
      hp: bossHp,
      maxHp: bossHp,
      attackDamage: bossAttackDamage
    });

    console.log(
      "Done initializing boss %s w/ HP %s, img %s",
      bigBoss.name,
      bigBoss.hp,
      bigBoss.imageURI
    );

    // Loop through all the vikings, and save their values in our contract so
    // we can use them later when we mint our NFTs.
    for (uint256 i = 0; i < vikingNames.length; i++) {
      defaultVikings.push(
        VikingAttributes({
          vikingIndex: i,
          name: vikingNames[i],
          class: classes[i],
          imageURI: vikingImageURIs[i],
          hp: vikingHp[i],
          maxHp: vikingHp[i],
          attackDamage: vikingAttackDmg[i]
        })
      );

      VikingAttributes memory c = defaultVikings[i];
      console.log("\nInitializing Viking\nName: %s\nType: %s", c.name, c.class);
      console.log(
        "HP: %s\nAttack Damage: %s\nImage: %s\n",
        c.hp,
        c.attackDamage,
        c.imageURI
      );
    }

    // increment tokenIds
    _tokenIds.increment();
  }

  // Users would be able to hit this function and get their NFT based on the
  // vikingId they send in!
  function mintVikingNFT(uint256 _vikingIndex) external {
    // Get current tokenId (starts at 1 since we incremented in the constructor).
    uint256 newItemId = _tokenIds.current();

    // The magical function! Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, newItemId);

    // We map the tokenId => their viking attributes. More on this in
    // the lesson below.
    nftHolderAttributes[newItemId] = VikingAttributes({
      vikingIndex: _vikingIndex,
      name: defaultVikings[_vikingIndex].name,
      class: defaultVikings[_vikingIndex].class,
      imageURI: defaultVikings[_vikingIndex].imageURI,
      hp: defaultVikings[_vikingIndex].hp,
      maxHp: defaultVikings[_vikingIndex].hp,
      attackDamage: defaultVikings[_vikingIndex].attackDamage
    });

    console.log(
      "Minted Viking NFT \nID: #%s\nIndex: %s",
      newItemId,
      _vikingIndex
    );

    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = newItemId;

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();

    // Emit mint event.
    emit VikingNFTMinted(msg.sender, newItemId, _vikingIndex);
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    override
    returns (string memory)
  {
    VikingAttributes memory vikingAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(vikingAttributes.hp);
    string memory strMaxHp = Strings.toString(vikingAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(
      vikingAttributes.attackDamage
    );

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            vikingAttributes.name,
            " #",
            Strings.toString(_tokenId),
            '", "description": "This is a Vikings NFT character!", "image": "',
            vikingAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Class", "value": "',
            vikingAttributes.class,
            '"}, { "trait_type": "Health Points", "value": ',
            strHp,
            ', "max_value":',
            strMaxHp,
            '}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,
            "} ]}"
          )
        )
      )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    return output;
  }

  function attackBoss() public {
    // Get the state of the player's NFT.
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    VikingAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

    console.log(
      "\nPlayer w/ character %s about to attack. Has %s HP and %s AD",
      player.name,
      player.hp,
      player.attackDamage
    );
    console.log(
      "Boss %s has %s HP and %s AD",
      bigBoss.name,
      bigBoss.hp,
      bigBoss.attackDamage
    );

    // Reset boss health when defeated.
    if (bigBoss.hp == 0) {
      bigBoss.hp = bigBoss.maxHp;
    }

    // Make sure the player is alive.
    require(player.hp > 0, "Error: character must have HP to attack boss.");

    // Make sure the boss is alive.
    require(bigBoss.hp > 0, "Error: boss must have HP to attack boss.");

    // Allow player to attack boss.
    if (bigBoss.hp < player.attackDamage) {
      bigBoss.hp = 0;
    } else {
      bigBoss.hp = bigBoss.hp - player.attackDamage;
    }

    // Allow boss to attack player.
    if (player.hp < bigBoss.attackDamage) {
      player.hp = 0;
    } else {
      player.hp = player.hp - bigBoss.attackDamage;
    }

    // Console log for player's hp after attack.
    console.log("Boss attacked player. New player hp: %s\n", player.hp);

    // Emit attack event.
    emit AttackComplete(bigBoss.hp, player.hp);
  }

  function checkIfUserHasNFT() public view returns (VikingAttributes memory) {
    // Get the tokenId of the user's character NFT
    uint256 userNftTokenId = nftHolders[msg.sender];
    // If the user has a tokenId in the map, return thier character.
    if (userNftTokenId > 0) {
      return nftHolderAttributes[userNftTokenId];
    }
    // Else, return an empty character.
    else {
      VikingAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultVikings()
    public
    view
    returns (VikingAttributes[] memory)
  {
    return defaultVikings;
  }

  function getBigBoss() public view returns (BigBoss memory) {
    return bigBoss;
  }
}
