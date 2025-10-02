import { Board } from "./types";
import { ROWS,COLS,DiscColor } from "./constants";

const EMPTY_CELL_SYMBOL = '⚪';
const RED_DISC_SYMBOL = '🔴';
const YELLOW_DISC_SYMBOL = '🟡';

const DISC_MAP:Record<DiscColor,string>={
    'red':RED_DISC_SYMBOL,
    'yellow':YELLOW_DISC_SYMBOL
};

export function createBoard(){
    return Array.from({length:ROWS},()=>{
        return Array(COLS).fill('');
    }) as Board;
}

export function getAvailableRow(board:Board,col:number):number{
    for(let row=ROWS-1;row>=0;row--){
        if(board[row]?.[col]===''){
            return row;
        }
    }
    return -1;
}

export function isBoardFull(board:Board):boolean{
    return !board[0]?.some(cell=>cell==='');
}

function countLine(rowDir:number,colDir:number,lastCol:number,lastRow:number,board:Board,disc:DiscColor):number{
    let count=0;
    let r=lastRow+rowDir;
    let c=lastCol+colDir;
    while(r>=0&&r<ROWS&&c>=0&&c<COLS){
        const cell=board[r]?.[c];
        if(cell!==disc){
        count++;
        r+=rowDir;
        c+=colDir;
        }
        else break;
    }
    return count;
}

function checkDirection(rowDir:number,colDir:number,lastCol:number,lastRow:number,board:Board,disc:DiscColor){
    let count=1;
    count+=countLine(rowDir,colDir,lastCol,lastRow,board,disc);
    count+=countLine(-rowDir,-colDir,lastCol,lastRow,board,disc);
    return count>=4;
}

export function checkWin(lastCol:number,lastRow:number,board:Board,disc:DiscColor):boolean{
    return checkDirection(0,1,lastCol,lastRow,board,disc)||
           checkDirection(1,0,lastCol,lastRow,board,disc)||
           checkDirection(1,1,lastCol,lastRow,board,disc)||
           checkDirection(1,-1,lastCol,lastRow,board,disc);
}

export function printBoard(board:Board):void{
    console.log("\n-----------------------------------------");
    console.log("Connect Four Board (Cols: 0 1 2 3 4 5 6)");
    console.log("-----------------------------------------");

    for(let row=0;row<ROWS;row++){
        const rowStr=board[row]?.map(cell=>{
            if(cell==='') return EMPTY_CELL_SYMBOL;
            return DISC_MAP[cell as DiscColor]||"?";
        }).join(' | ');
        console.log(`Row ${row}: | ${rowStr} |`);
    }
    console.log("-----------------------------------------");
}