export type HintsType = {
  hint: string;
  hintCount: number;
  isRedTurn: boolean;
}[];

export type UserType = {
  userID: string;
  team: string;
  role: string;
  isHost: boolean;
  socketId: string;
};

export type CardType = {
  word: string;
  color: string;
  isClicked: boolean;
};

export type DataType = {
  cards: CardType[];
  colors: string[];
  words: string[];
  clicked: Boolean[];
  isRedTurn: boolean;
  redTurn: boolean;
  gameOver: boolean;
  hints: HintsType;
  totalGameScore: [number, number];
  redScore: number;
  roomID: string;
  blueScore: number;
  redSpy: string;
  blueSpy: string;
  users: UserType[];
  userID: string;
  currentTimer: number;
  turnEndTime: Date;
};
