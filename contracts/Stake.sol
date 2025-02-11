// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stake {
    ERC20 public BeeToken;
    ERC20 public BooToken;

    mapping(address => uint) public beeStakers;
    mapping(address => uint) public booStakers;
    mapping(address => uint) public rewards;

    uint public totalBeeStaked;
    uint public totalBooStaked;
    uint public rewardRateBee = 10;
    uint public rewardRateBoo = 5;

    error InsufficientFunds();
    error AmountCannotBeZeroOrLess();
    error NotEnoughStake();
    error NotEnoughRewards();

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
        if (_amountOfBee == 0 && _amountOfBoo == 0) revert AmountCannotBeZeroOrLess();
        
        if (_amountOfBee > 0) {
            if (beeStakers[msg.sender] < _amountOfBee) revert NotEnoughStake();
            BeeToken.transfer(msg.sender, _amountOfBee);
            beeStakers[msg.sender] -= _amountOfBee;
            totalBeeStaked -= _amountOfBee;
        }

        if (_amountOfBoo > 0) {
            if (booStakers[msg.sender] < _amountOfBoo) revert NotEnoughStake();
            BooToken.transfer(msg.sender, _amountOfBoo);
            booStakers[msg.sender] -= _amountOfBoo;
            totalBooStaked -= _amountOfBoo;
        }
    }

    function getRewards(address user) public view returns (uint) {
        uint beeReward = beeStakers[user] * rewardRateBee;
        uint booReward = booStakers[user] * rewardRateBoo;
        return beeReward + booReward;
    }

    function getTotalStaked() external view returns (uint bee, uint boo) {
        return (totalBeeStaked, totalBooStaked);
    }

    function getUserStake(address user) external view returns (uint bee, uint boo) {
        return (beeStakers[user], booStakers[user]);
    }
}
