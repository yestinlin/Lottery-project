// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract Lottery{
   
   
    address public manager;
    address[] public players;


    constructor () {
        manager = msg.sender;
    }

    modifier requirement(){
        require(msg.sender == manager,"Not the manager");
        _;
    }

    function enter() public payable {
        require(msg.value >= 0.01 ether, "Need at least 0.01 ether to enter");
        players.push(msg.sender);

    }

    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));


    }

    function pickWinner() public requirement{
        
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);  //All balance send to this address
        players = new address[](0);
    }
    
    function getPlayers() public view returns(address[] memory){
        return players;
    }

} 