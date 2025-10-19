import { Bot } from "./bot";
import { 
    createBoard,
    getAvailableRow,
    isBoardFull,
    printBoard,
    checkWin
} 
from "./board";
import { Player,GameState, Board } from "./types";
import { DiscColor } from "./constants";
import { v4 as uuidv4 } from 'uuid';

export function makeMove(gameState:GameState,playerId:string,column:number):GameState | null{

    if(gameState.status !== 'in_progress' || gameState.turn!==playerId){
        return null;
    }
    const discColor=gameState.playerColors[playerId as string];
    const row=getAvailableRow(gameState.board,column);

    if(!discColor||row===-1){
        return null;
    }

    const nextBoard:Board=gameState.board.map(r=>[...r]) as Board;
    nextBoard[row]![column]=discColor;

    let nextStatus:GameState['status']='in_progress';
    let winnerId:string|'draw'|null=null;
    
    const currentPlayerId=playerId as string;

    if(checkWin(column,row,nextBoard,discColor)){
        nextStatus='finished';
        winnerId=currentPlayerId;
    } else if(isBoardFull(nextBoard)){
        nextStatus='finished';
        winnerId='draw';
    }

    const nextPlayer=gameState.players.find(p=>p.id!==playerId);
    const nextTurnId=nextStatus==='in_progress' && nextPlayer ? nextPlayer.id : currentPlayerId;

    return{
        ...gameState,
        board:nextBoard,
        turn:nextTurnId,
        status:nextStatus,
        winner:winnerId,
        lastMove:{row,col:column,playerId:currentPlayerId}
    };
}

export class Game{
    public state:GameState;
    private botInstance:Bot | undefined;

    constructor(player1:Player,player2:Player,playerColors:{[key:string]:DiscColor}){
        player1.disc=playerColors[player1.id];
        player2.disc=playerColors[player2.id];

        this.state={
            gameId:uuidv4(),
            players:[player1,player2],
            board:createBoard(),
            turn:player1.id,
            status:'in_progress',
            winner:null,
            playerColors,
            lastMove:undefined
        };

        const botPlayer=this.state.players.find(p=>p.isBot);
        const botDisc=botPlayer?this.state.playerColors[botPlayer.id]:undefined;

        if(botPlayer&&botDisc&&botPlayer.id){
            this.botInstance=new Bot(botPlayer.id,botDisc);
        }
    }


    public processMove(playerId: string, col: number): GameState | null {
        const newState = makeMove(this.state, playerId, col);
        if (newState) {
            this.state = newState;
        }
        return newState;
    }

    public getBotMoveColumn(): number | null {
        if (!this.botInstance || this.state.status !== 'in_progress') {
            return null;
        }
        return this.botInstance.getMove(this.state.board);
    }

    public getPublicState(): GameState {
        return { ...this.state };
    }
    
    public updateStatus(status: GameState['status'], winnerId: string | 'draw' | null): void {
        this.state.status = status;
        this.state.winner = winnerId;
    }
}