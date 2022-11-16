// SPDX-License-Identifier: Chainlink Hackathon Fall 2022
// With thanks to Truflation, CryptoZombies, Remix, OpenZeppelin, Alchemy, and Ankr devblog 
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";


contract CactuStipend is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    constructor() ConfirmedOwner(msg.sender) {
        //testUSD (uses DAI)
        allowToken(0x2C3126191A8eA852f91520D90349928fB607a49d, true, "testUSD", 0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046);
        //LINK
        allowToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB, true, "Chainlink", 0x12162c3E810393dEC01362aBf156D7ecf6159528);
        
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        }

/*

    Add price feeds for other test tokens (and don't forget that chainlink uses a LINK/MATIC feed
    on mumbai)

    Approve 1000000000000000000000000000 testUSD on testUSD contract

    FEED IT 0.1 LINK
    DON'T FORGET
    IT WILL REVERT OTHERWISE
    FEED IT 0.1 LINK
    OR COMMENT OUT TRUFLATION CALL

    function testStipend() public onlyOwner() {
        createStipend (msg.sender, 
        0x2C3126191A8eA852f91520D90349928fB607a49d, 
        100,
        1,
        1000000);

        // "cool stipend", 0x2593F5FbFd610504cfD98d0a52770A4FD8202CeA, 0x2C3126191A8eA852f91520D90349928fB607a49d, 100, 1, 1000000
    } 
*/


//  *  *  *  *  *  STIPEND FUNCTIONS  *  *  *  *  *  //
    
    struct Stipend {
        string stipendName;
        address stipendOwner;        
        uint256 stipendId;
        address stipendToken;
        //uint8 unitDenomination; //0 for usd, 1 for gbp
        uint256 paymentAmount; //in usd or gbp
        uint256 paymentInterval; //in hours
        uint256 stipendBalance; //in chosen stipendToken
        uint256 nextInterval; //blocktime + paymentInterval * time unit
        uint256 accumulatedBaseline;
        //uint256 userCount;
        bool readyForPayment;
        bool exists;
        string stipendTokenName;
    }

    mapping (address => bool) allowedTokens;
    mapping (address => address) tokenToUSDPriceFeed;
    mapping (address => string) public stipendTokenNames;
    mapping (uint256 => Stipend) public createdStipends;
    uint256 public stipendIterator = 1;
    uint256 nextInflationUpkeep;
    int256 usdInflationPercent;
    mapping (address => mapping (uint256 => uint256)) public userBalancesByStipend;
    mapping (address => mapping (uint256 => bool)) public userValidityByStipend;
    mapping (address => mapping (uint256 => bool)) userRemovedFromStipend;

    //only allow tokens with 18 decimals and no tax-on-transfer
    function allowToken(address _newToken, bool _allow, string memory _name, address _pricefeed) public onlyOwner {
        tokenToUSDPriceFeed[_newToken] = _pricefeed;
        allowedTokens[_newToken] = _allow;
        stipendTokenNames[_newToken] = _name;
    }

    function checkAllowanceOf(address _stipendToken) public view returns (bool) {
        return IERC20(_stipendToken).allowance(msg.sender, address(this)) > 0;
    }
    
    //pass intended token amounts, not wei values
    function createStipend(
        string memory _stipendName,
        address _stipendOwner, 
        address _stipendToken, 
        //uint8 _unitDenomination, 
        uint256 _paymentAmount,
        uint256 _paymentInterval,
        uint256 _stipendBalance) public {
        require (_stipendOwner == msg.sender);
        require (allowedTokens[_stipendToken] == true);
        require (_stipendBalance > 0 && _stipendBalance * uint256(10 ** 18) <= IERC20(_stipendToken).balanceOf(msg.sender));
        require (_paymentAmount >= 0);
        IERC20(_stipendToken).transferFrom(msg.sender, address(this), _stipendBalance * uint256(10 ** 18));
        uint256 _stipendId = stipendIterator;
        stipendIterator++;
        Stipend storage stipend = createdStipends[_stipendId];
        stipend.stipendName = _stipendName;
        stipend.stipendOwner = _stipendOwner;       
        stipend.stipendId = _stipendId;
        stipend.stipendToken = _stipendToken;
        //stipend.unitDenomination = _unitDenomination;
        stipend.paymentAmount = _paymentAmount;
        stipend.paymentInterval = _paymentInterval;
        stipend.stipendBalance = _stipendBalance * uint256(10 ** 18);
        stipend.accumulatedBaseline = 0;
        stipend.nextInterval = block.timestamp + (_paymentInterval * 1); //(default 3600, can set custom time later
        //stipend.userCount = 0;
        stipend.readyForPayment = false;
        stipend.exists = true;
        stipend.stipendTokenName = stipendTokenNames[_stipendToken];
        emit StipendCreated(_stipendOwner, _stipendId);
        }
    
    function getNumberofStipends() public view returns(uint256) {
        return stipendIterator;
    }
        
    function getStipend(uint256 _stipendId) public view returns(Stipend memory) {
        return createdStipends[_stipendId];
    }

    function getAllStipends() public view returns (Stipend[] memory allStipends) {
        allStipends = new Stipend[](stipendIterator - 1);
        for (uint256 i = 1; i < stipendIterator; i++) {
            allStipends[i-1] = createdStipends[i];
        }
        return allStipends;
    }

    function checkStipendOwnership(uint256 _stipendId, address _user) public view returns (bool) {
        return createdStipends[_stipendId].stipendOwner == _user;
    }

    function addToBalance(uint256 _stipendId, address _stipendToken, uint256 _amount) public {
        require (createdStipends[_stipendId].stipendToken == _stipendToken);
        require(_amount > 0 && _amount * uint256(10 ** 18) <= IERC20(_stipendToken).balanceOf(msg.sender));
        IERC20(_stipendToken).transferFrom(msg.sender, address(this), _amount * uint256(10 ** 18));
        createdStipends[_stipendId].stipendBalance = createdStipends[_stipendId].stipendBalance + (_amount * uint256(10 ** 18));
        emit AddedToBalance(msg.sender, _stipendId, _amount);
    }  

     function withdrawFromBalance(uint256 _stipendId, uint256 _amount) public {
        require (createdStipends[_stipendId].stipendOwner == msg.sender);
        require(_amount > 0 && _amount * uint256(10 ** 18) <= createdStipends[_stipendId].stipendBalance);
        IERC20(createdStipends[_stipendId].stipendToken).transfer(msg.sender, _amount * uint256(10 ** 18));
        createdStipends[_stipendId].stipendBalance = createdStipends[_stipendId].stipendBalance - (_amount * uint256(10 ** 18));
        emit WithdrewFromBalance(msg.sender, _stipendId, _amount);
    }  

    function changePaymentAmount(uint256 _stipendId, uint256 _amount) public {
        require (createdStipends[_stipendId].stipendOwner == msg.sender);
        require (_amount >= 0);
        createdStipends[_stipendId].paymentAmount = _amount;
        emit ChangedPaymentAmount(_stipendId, _amount);
    }

    function changePaymentInterval(uint256 _stipendId, uint256 _newInterval) public {
        require (createdStipends[_stipendId].stipendOwner == msg.sender);
        createdStipends[_stipendId].paymentInterval = _newInterval;
        emit ChangedPaymentInterval(_stipendId, _newInterval);
    }

    function userJoinStipend(uint256 _stipendId, address _user) public {
        //require EligibilityCriterion == true;
        require (_user == msg.sender);
        require (_stipendId != 0);
        require (checkStipendExistence(_stipendId) == true);
        require (checkUserValidity(_stipendId, _user) == false);
        require (userRemovedFromStipend[_user][_stipendId] == false);
        userValidityByStipend[_user][_stipendId] = true;
        userBalancesByStipend[_user][_stipendId] = createdStipends[_stipendId].accumulatedBaseline;
        //createdStipends[_stipendId].userCount ++;
        emit StipendJoined(_user, _stipendId);
    }

    function checkUserValidity(uint256 _stipendId, address _user) public view returns (bool) {
        return userValidityByStipend[_user][_stipendId];
    }

    function checkStipendExistence(uint256 _stipendId) public view returns (bool) {
        return createdStipends[_stipendId].exists;
    }

    function creatorGiftStipend(uint256 _stipendId, address _recipient) public {
        require (createdStipends[_stipendId].stipendOwner == msg.sender);
        require (checkUserValidity(_stipendId, _recipient) == false);
        userValidityByStipend[_recipient][_stipendId] = true;
        userBalancesByStipend[_recipient][_stipendId] = createdStipends[_stipendId].accumulatedBaseline;
        //createdStipends[_stipendId].userCount ++;
        emit StipendJoined(_recipient, _stipendId);
        }

    function userPendingBalance(uint _stipendId, address _user) view public returns(uint256) {
        return createdStipends[_stipendId].accumulatedBaseline - userBalancesByStipend[_user][_stipendId];
        }
    
    struct JoinedStipends {
        string stipendName;
        string stipendToken;
        uint256 stipendId;
        uint256 paymentAmount;
        uint256 paymentInterval;
        uint256 pendingBalance;
    }

    function getUserJoinedStipends(address _user) public view returns (JoinedStipends[] memory userJoinedStipends) {
        uint256 joinedStipends;
        for (uint256 i = 1; i < stipendIterator; i++) {
            if (checkUserValidity(i, _user) == true) {
                joinedStipends++;
            }
        }
            userJoinedStipends = new JoinedStipends[](joinedStipends);
            uint256 j;
            
            for (uint256 i = 1; i < stipendIterator; i++) {
                if (checkUserValidity(i, _user) == true) {
                JoinedStipends memory stipendInfo;
                stipendInfo.stipendName = createdStipends[i].stipendName;
                stipendInfo.stipendToken = stipendTokenNames[createdStipends[i].stipendToken];
                stipendInfo.stipendId = createdStipends[i].stipendId;
                stipendInfo.paymentAmount = createdStipends[i].paymentAmount;
                stipendInfo.paymentInterval = createdStipends[i].paymentInterval;
                stipendInfo.pendingBalance = userPendingBalance(createdStipends[i].stipendId, _user);
                userJoinedStipends[joinedStipends - (joinedStipends - (1 * j))] = stipendInfo;
                j++;
                }
        }
        return userJoinedStipends;
    }

/*

    function getUserJoinedStipends(address _user) public view returns (Stipend[] memory userJoinedStipends) {
        uint256 joinedStipends;
        for (uint256 i = 1; i < stipendIterator; i++) {
            if (checkUserValidity(i, _user) == true) {
                joinedStipends++;
            }
        }
            userJoinedStipends = new Stipend[](joinedStipends);
            uint256 j;
            for (uint256 i = 1; i < stipendIterator; i++) {
                if (checkUserValidity(i, _user) == true) {
                userJoinedStipends[joinedStipends - (joinedStipends - (1 * j))] = createdStipends[i];
                j++;
                }
        }
        return userJoinedStipends;
    }
*/
       function getUserOwnedStipends(address _user) public view returns (Stipend[] memory userOwnedStipends) {
        uint256 ownedStipends;
        for (uint256 i = 1; i < stipendIterator; i++) {
            if (checkStipendOwnership(i, _user) == true) {
                ownedStipends++;
            }
        }
            userOwnedStipends = new Stipend[](ownedStipends);
            uint256 j;
            for (uint256 i = 1; i < stipendIterator; i++) {
                if (checkStipendOwnership(i, _user) == true) {
                userOwnedStipends[ownedStipends - (ownedStipends - (1 * j))] = createdStipends[i];
                j++;
                }
        }
        return userOwnedStipends;
    }

    //keeper/manual call
    function initiatePaymentUpdate() public {
        for (uint256 i = 1; i < stipendIterator; i++) {
            if (createdStipends[i].nextInterval <= block.timestamp) {
                createdStipends[i].nextInterval = block.timestamp + (createdStipends[i].paymentInterval * 1); //3600
                createdStipends[i].readyForPayment = true;
            }
        }
        uint256 inflation = uint256(1000000000000000000 + usdInflationPercent);
        for (uint256 i; i < stipendIterator; i++) {
            if (createdStipends[i].readyForPayment == true) {
                createdStipends[i].accumulatedBaseline = createdStipends[i].accumulatedBaseline + (((createdStipends[i].paymentAmount * inflation) * (10 ** uint256(AggregatorV3Interface(tokenToUSDPriceFeed[createdStipends[i].stipendToken]).decimals()))) / uint256(getLatestPrice(tokenToUSDPriceFeed[createdStipends[i].stipendToken])));
                createdStipends[i].readyForPayment = false;
                emit PaymentDistributed(i);
                }
            }
        if (block.timestamp >= nextInflationUpkeep) {
            nextInflationUpkeep = block.timestamp + 86400;
            requestInflationWei();
          }  
        }

    function fulfillInflationWei(bytes32 _requestId, bytes memory _inflation) virtual public recordChainlinkFulfillment(_requestId) {
        usdInflationPercent = toInt256(_inflation);
        emit InflationUpdated(usdInflationPercent);
        }

    function getLatestPrice(address _stipendToken) internal view returns (int256) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(_stipendToken).latestRoundData();
        if (price < 0) {
            return 0;
        }
        return price;
    }

    function userClaimStipend(uint256 _stipendId, address _user) public {
        require (_user == msg.sender);
        require (checkUserValidity(_stipendId, _user) == true);
        require (createdStipends[_stipendId].stipendBalance >= createdStipends[_stipendId].accumulatedBaseline - userBalancesByStipend[_user][_stipendId]);
        require (createdStipends[_stipendId].accumulatedBaseline - userBalancesByStipend[_user][_stipendId] >= 0);
        uint256 _transferBalance = (createdStipends[_stipendId].accumulatedBaseline - userBalancesByStipend[_user][_stipendId]);
        IERC20(createdStipends[_stipendId].stipendToken).transfer(_user, _transferBalance);
        createdStipends[_stipendId].stipendBalance = createdStipends[_stipendId].stipendBalance - _transferBalance;
        userBalancesByStipend[_user][_stipendId] = createdStipends[_stipendId].accumulatedBaseline;
        emit ClaimedStipend(_user, _stipendId, _transferBalance);
    }

    function removeUser(uint256 _stipendId, address _user) public {
        require (createdStipends[_stipendId].stipendOwner == msg.sender);
        userRemovedFromStipend[_user][_stipendId] = true;
        userValidityByStipend[_user][_stipendId] = false;
        //createdStipends[_stipendId].userCount --;
    }


//  *  *  *  *  *  TRUFLATION FUNCTIONS  *  *  *  *  *  //

    address oracleId = 0x17dED59fCd940F0a40462D52AAcD11493C6D8073;
    string jobId = "8b459447262a4ccf8863962e073576d9";
    uint256 fee = 10000000000000000;

    function changeOracle(address _oracle) public onlyOwner {
        oracleId = _oracle;
    }

    function changeJobId(string memory _jobId) public onlyOwner {
        jobId = _jobId;
    }

      function changeFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function requestInflationWei() public returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(
      bytes32(bytes(jobId)),
      address(this),
      this.fulfillInflationWei.selector
    );
    req.add("service", "truflation/current");
    req.add("keypath", "yearOverYearInflation");
    req.add("abi", "int256");
    req.add("multiplier", "10000000000000000");
    return sendChainlinkRequestTo(oracleId, req, fee);
    }

    function toInt256(bytes memory _bytes) internal pure
    returns (int256 value) {
    assembly {
      value := mload(add(_bytes, 0x20))
    }
    }

//  *  *  *  *  *  EVENTS  *  *  *  *  *  //

    event StipendCreated(address indexed _stipendCreator, uint256 indexed _stipendId);
    event StipendJoined(address indexed _user, uint256 indexed _stipendId);
    event ClaimedStipend(address indexed _user, uint256 indexed _stipendId, uint256 indexed _transferBalance);
    event PaymentDistributed(uint256 indexed _stipendId);
    event InflationUpdated(int256 indexed _inflation);
    event AddedToBalance(address indexed _donor, uint256 indexed _stipendId, uint256 _amount);
    event WithdrewFromBalance(address indexed _stipendCreator, uint256 indexed _stipendId, uint256 _amount);
    event ChangedPaymentAmount(uint256 indexed _stipendId, uint256 indexed _amount);
    event ChangedPaymentInterval(uint256 indexed _stipendId, uint256 indexed _interval);
}
