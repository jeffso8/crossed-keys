import { CardType, UserType } from "../types";

export type GameData = {
    roomId: string;
    redScore: number;
    blueScore: number;
    words: string[];
    users: UserType[];
    user: UserType | null;
    cards: CardType[];
    isRedTurn: Boolean;
    turnEndTime: number;
    gameOver: boolean;
};