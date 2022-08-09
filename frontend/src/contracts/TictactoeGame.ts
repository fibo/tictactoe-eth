export enum GameStatus {
  WaitingForPlayerOne,
  WaitingForPlayerTwo,
  Playing,
}

export enum GridPosition {
  Space0,
  Space1,
  Space2,
  Space3,
  Space4,
  Space5,
  Space6,
  Space7,
  Space8,
}

export enum Player {
  PlayerOne,
  PlayerTwo,
}

export interface TictactoeGame {
  gameStatus: GameStatus;
  burn(): void;
  join(): void;
  move(position: GridPosition): void;
}
