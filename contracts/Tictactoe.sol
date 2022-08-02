// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Tictactoe {
    enum Status {
        WaitingForPlayerOne,
        WaitingForPlayerTwo,
        Playing
    }

    // default value is the first element, WaitingForPlayerOne
    Status public status;

    address owner;

    address public player1;
    address public player2;

    uint8[8] moves;

    constructor() {
        owner = msg.sender;
    }

    function join() public {
        if (status == Status.WaitingForPlayerOne) {
            player1 = msg.sender;
            status = Status.WaitingForPlayerTwo;
        } else if (status == Status.WaitingForPlayerTwo) {
            player2 = msg.sender;
            status = Status.Playing;
        }
    }

    function endGame() private {
        // delete resets the enum to its first value, WaitingForPlayerOne
        delete status;
    }
}
