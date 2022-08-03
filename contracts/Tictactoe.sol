// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// A player join game twice.
error CannotPlayAgainstYourSelf();

/// A player join game but other players are already playing.
error CannotJoinGameWhilePlaying();

/// A player choose a grid position but it was already taken.
error GridPositionAlreadyTaken();

/// A player try to do some game move but the game is not playing yet.
error NotPlaying();

/// A player try to do some game move but it is not his/her turn.
error NotYourTurn();

contract Tictactoe {
    enum Player {
        PlayerOne,
        PlayerTwo
    }

    mapping (Player => address) player;

    enum GameStatus {
        WaitingForPlayerOne,
        WaitingForPlayerTwo,
        Playing
    }

    GameStatus public gameStatus;

    enum GridPosition {
        Space1,
        Space2,
        Space3,
        Space4,
        Space5,
        Space6,
        Space7,
        Space8,
        Space9
    }

    uint8 nextChoiceIndex;

    /// Map uint8 index choice to GridPosition chosen by player.
    mapping (uint8 => GridPosition) public playerChoice;

    mapping (GridPosition => bool) public gridPositionIsEmpty;

    event Join(address indexed _player);

    event GameStatusChange(GameStatus indexed _status);

    function startGame() private {
        nextChoiceIndex = 0;

        // Reset grid
        gridPositionIsEmpty[GridPosition.Space1] = true;
        gridPositionIsEmpty[GridPosition.Space2] = true;
        gridPositionIsEmpty[GridPosition.Space3] = true;
        gridPositionIsEmpty[GridPosition.Space4] = true;
        gridPositionIsEmpty[GridPosition.Space5] = true;
        gridPositionIsEmpty[GridPosition.Space6] = true;
        gridPositionIsEmpty[GridPosition.Space7] = true;
        gridPositionIsEmpty[GridPosition.Space8] = true;
        gridPositionIsEmpty[GridPosition.Space9] = true;

        gameStatus = GameStatus.Playing;
        emit GameStatusChange(GameStatus.Playing);
    }

    function join() external {
        if (gameStatus == GameStatus.Playing)
            revert CannotJoinGameWhilePlaying();

        if (gameStatus == GameStatus.WaitingForPlayerOne) {
            player[Player.PlayerOne] = msg.sender;
            gameStatus = GameStatus.WaitingForPlayerTwo;
            emit Join(msg.sender);
            emit GameStatusChange(GameStatus.WaitingForPlayerTwo);
        } else if (gameStatus == GameStatus.WaitingForPlayerTwo) {
            if(msg.sender == player[Player.PlayerOne])
                revert CannotPlayAgainstYourSelf();
            player[Player.PlayerTwo] = msg.sender;
            startGame();
        }
    }

    function endGame() private {
        delete gameStatus;

        emit GameStatusChange(GameStatus.WaitingForPlayerOne);
    }

    function isWinner () private view returns (bool) {
        if (nextChoiceIndex <= 3)
            return false;
        return true;
    }

    function move (GridPosition _gridPosition) external {
        if(gameStatus != GameStatus.Playing)
            revert NotPlaying();

        // Player is an enum where
        //     PlayerOne = 0
        //     PlayerTwo = 1
        // so nextChoiceIndex modulus two equals current player enum value.
        Player currentPlayer;
        if(nextChoiceIndex % 2 == 0) {
          currentPlayer = Player.PlayerOne;
        } else {
          currentPlayer = Player.PlayerTwo;
        }

        if(msg.sender != player[currentPlayer])
            revert NotYourTurn();

        if (!gridPositionIsEmpty[_gridPosition])
            revert GridPositionAlreadyTaken();

        playerChoice[nextChoiceIndex] = _gridPosition;

        if (isWinner())
            endGame();

        nextChoiceIndex++;

        if (nextChoiceIndex == 8)
            endGame();
    }
}
