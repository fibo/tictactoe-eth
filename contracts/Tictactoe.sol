// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// A player join game twice.
error CannotPlayAgainstYourSelf();

/// A player join game but other players are already playing.
error CannotJoinGameWhilePlaying();

/// A player choose a grid position but it was already taken.
error GridPositionAlreadyTaken();

/// A player try to do some game move but it is not his/her turn.
/// A player try to move but it is not player one not player two.
/// A player try to do some game move but the game is not started yet.
error CannotMoveNow();

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
        Space0,
        Space1,
        Space2,
        Space3,
        Space4,
        Space5,
        Space6,
        Space7,
        Space8
    }

    uint8 nextChoiceIndex;

    /// Map uint8 index choice to GridPosition chosen by player.
    mapping (uint8 => GridPosition) public playerChoice;

    mapping (GridPosition => bool) public gridPositionIsEmpty;

    event Join(address indexed player);

    event GameStatusChange(GameStatus indexed gameStatus);

    event Winner(address indexed player);

    function startGame() private {
        nextChoiceIndex = 0;

        // Reset grid
        gridPositionIsEmpty[GridPosition.Space0] = true;
        gridPositionIsEmpty[GridPosition.Space1] = true;
        gridPositionIsEmpty[GridPosition.Space2] = true;
        gridPositionIsEmpty[GridPosition.Space3] = true;
        gridPositionIsEmpty[GridPosition.Space4] = true;
        gridPositionIsEmpty[GridPosition.Space5] = true;
        gridPositionIsEmpty[GridPosition.Space6] = true;
        gridPositionIsEmpty[GridPosition.Space7] = true;
        gridPositionIsEmpty[GridPosition.Space8] = true;

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

    function semiSumInZ3xZ3 (uint8 index1, uint8 index2) private pure returns (uint8) {
        uint8 x1 = index1 % 3;
        uint8 y1 = (index1 - x1) / 3;

        uint8 x2 = index2 % 3;
        uint8 y2 = (index2 - x2) / 3;

        uint8 x3 = ((x1 + x2) * 2) % 3;
        uint8 y3 = ((y1 + y2) * 2) % 3;

        return x3 + 3 * y3;
    }

    function isWinCombination (uint8 index1, uint8 index2, uint8 index3) private pure returns (bool) {
        if (semiSumInZ3xZ3(index1, index2) != index3)
            return false;
        return true;
    }

    function isWinner () private view returns (bool) {
        if (nextChoiceIndex <= 4)
            return false;

        uint8 numPlayers = 2;
        uint8 firstIndexOfCurrentPlayer = nextChoiceIndex % 2;
        uint8 endOfThirdIndex = nextChoiceIndex;
        uint8 endOfSecondIndex = endOfThirdIndex - numPlayers;
        uint8 endOfFirstIndex = endOfSecondIndex - numPlayers;

        for (uint8 i = firstIndexOfCurrentPlayer; i <= endOfFirstIndex; i += numPlayers)
            for (uint8 j = i + numPlayers; j <= endOfSecondIndex; j += numPlayers)
                for (uint8 k = j + numPlayers; k <= endOfThirdIndex; k += numPlayers)
                    if (isWinCombination(i, j, k))
                        return true;

        return false;
    }

    function move (GridPosition gridPosition) external {
        if(gameStatus != GameStatus.Playing)
            revert CannotMoveNow();

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
            revert CannotMoveNow();

        if (!gridPositionIsEmpty[gridPosition])
            revert GridPositionAlreadyTaken();

        playerChoice[nextChoiceIndex] = gridPosition;

        if (isWinner()) {
            emit Winner(player[currentPlayer]);
            endGame();
        }

        // Increment nextChoiceIndex only after isWinner() run
        nextChoiceIndex++;

        if (nextChoiceIndex == 8)
            endGame();
    }
}
