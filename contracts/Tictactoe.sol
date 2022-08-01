// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Tictactoe {
  address payable public owner;

  bool public isPlaying = false;

  uint8[8] public moves;

  constructor() {
    owner = payable(msg.sender);
  }
}