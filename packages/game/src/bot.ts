import { Board } from "./types";
import { DiscColor,COLS } from "./constants";
import{ getAvailableRow,checkWin } from "./board";

export class Bot{
    public id:string;
    private readonly botDisc:DiscColor;
    private readonly opponentDisc:DiscColor;

    constructor(id:string,botDisc:DiscColor){
        this.id=id;
        this.botDisc=botDisc;
        this.opponentDisc=(botDisc==='red'?'yellow':'red')as DiscColor;
    }

    public getMove(board:Board):number{
        const winningMove=this.findWinningMove(board,this.botDisc);
        if(winningMove!==-1){
            return winningMove;
        }
        const blockMove=this.findWinningMove(board,this.opponentDisc);
        if(blockMove!==-1){
            return blockMove;
        }
        return this.findStrategicMove(board);
    }

    private findWinningMove(board:Board,disc:DiscColor):number{
        for(let col=0;col<COLS;col++){
            const row=getAvailableRow(board,col);
            if(row!==-1){
                board[row]![col]=disc;
                if(checkWin(col,row,board,disc)){
                    board[row]![col]='';
                    return col;
                }
                board[row]![col]='';
            }
        }
        return -1;
    }

    private findStrategicMove(board:Board):number{
        const stratergicCols=[3,2,4,1,5,0,6];
        for (const col of stratergicCols){
            if(getAvailableRow(board,col)!==-1){
                return col;
            }
        }
        return 3;
    }
}