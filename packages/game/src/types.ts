import { DiscColor,COLS, ROWS } from "./constants";

export type Board=(''|DiscColor)[][];

export interface Player{
    id:string;
    username:string;
    isBot?:boolean;
    disc?:DiscColor;
}

export interface GameState{
    gameId:string;
    players:Player[];
    board:Board;
    turn:string;
    status:'waiting'|'in_progress'|'finished'|'forfeited';
    winner:string|'draw'|null;
    playerColors:{[playerId:string]:DiscColor}
    lastMove?:{row:number;col:number;playerId:string};
}

export interface ServerMessage{
    type:'game_start'|'game_update'|'game_over'|'reconnect_success'|'error'|'leaderboard';
    payload:any;
}

export interface ClientMessage{
    type:'JOIN'|'MOVE'|'RECONNECT'|'FORFEIT';
    payload:any;
}