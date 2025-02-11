// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stake {
    ERC20 public BeeToken;
    ERC20 public BooToken;
    
    mapping(address => uint) public beeStakers;
    mapping(address => uint) public booStakers;

    uint public totalBeeStaked;
    uint public totalBooStaked;

    error InsufficientFunds();
    error AmountCanotBeZeroOrLess();

    constructor(address _tokenBee, address _tokenBoo) {
        BeeToken = ERC20(_tokenBee);
        BooToken = ERC20(_tokenBoo);
    }

    function stakeTokens(uint _amountOfBee, uint _amountOfBoo) external {
        if (_amountOfBee == 0 && _amountOfBoo == 0) revert InsufficientFunds();

        if (_amountOfBee > 0) {
            BeeToken.transferFrom(msg.sender, address(this), _amountOfBee);
            beeStakers[msg.sender] += _amountOfBee;
            totalBeeStaked += _amountOfBee;
        }

        if (_amountOfBoo > 0) {
            BooToken.transferFrom(msg.sender, address(this), _amountOfBoo);
            booStakers[msg.sender] += _amountOfBoo;
            totalBooStaked += _amountOfBoo;
        }
    }

   function unstakeTokens(uint _amountOfBee, uint _amountOfBoo) external {
        if (_amountOfBee == 0 && _amountOfBoo == 0) revert AmountCanotBeZeroOrLess();

        if (_amountOfBee > 0) {
            BeeToken.transferFrom(msg.sender, address(this), _amountOfBee);
            beeStakers[msg.sender] -= _amountOfBee;
            totalBeeStaked -= _amountOfBee;
        }

        if (_amountOfBoo > 0) {
            BooToken.transferFrom(msg.sender, address(this), _amountOfBoo);
            booStakers[msg.sender] -= _amountOfBoo;
            totalBooStaked -= _amountOfBoo;
        }
    }

}

