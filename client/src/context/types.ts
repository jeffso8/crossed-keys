import { CardType, UserType } from "../types";

export type GameData = {
    roomId: string;
    gameScore: [number, number];
    words: string[];
    users: UserType[];
    user: UserType | null;
    cards: CardType[];
};