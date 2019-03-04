class View {

    drawBoard(size:number){
        let board = document.getElementById("board");
        let content = "";
        let length = Math.sqrt(size);
        for(let i = 0; i<size;i++){
            content = content + '<div id="s'+i+'" class="square"></div>';
            if((i+1)%length==0){
                content = content + '<div style="clear:both;"></div>';
            }
        }
        content = content + '<div style="clear:both;"></div>';
        board.innerHTML = content;
    }
    
    changeLife(life){
        document.getElementById("life").innerHTML = life;
    }

    changeScore(score){
        document.getElementById("score").innerHTML = score;
    }

    changeTime(time){
        document.getElementById("timeValue").innerHTML = time;
    }

    lightSquare(id,color){
        document.getElementById(id).style.background = color;
    }

}

class Controller {

    private view:View;
    private model:Model;
    private sizeBoard = 25;

    constructor(){
        this.view = new View();
        this.model = new Model(this.view,this.sizeBoard);
        this.view.drawBoard(this.sizeBoard);
    }

    clickStart(){
        document.getElementById("start").disabled = true;
        document.getElementById("reset").disabled = false;
        this.model.incrementTime();
    }

    clickReset(){
        this.model.resetGame();
    }

}

class Model {

    private refreshIntervalId;
    private random: number;
    private timeToClick: number;
    private life: number = 3;
    private score: number = 0;

    constructor(private view: View,private sizeBoard:number){
        
    }

    checkEnd(time) {
        if(time==60000){
            alert("KONIEC!!!");
            clearInterval(this.refreshIntervalId);
        }
    }

    incrementTime(){
        let time = 1000;
        this.timeToClick = 1000;
        this.refreshIntervalId = setInterval(()=>{
            this.view.changeTime(time/1000);
            if(this.timeToClick%2000==0){
                if(this.timeToClick==2000){
                    this.addClick();
                    this.random = Math.floor(Math.random() * (this.sizeBoard));
                    this.view.lightSquare("s"+this.random,"#009900");
                }else{
                    this.life -= 1;
                    this.view.changeLife(this.life);
                    this.view.lightSquare("s"+this.random,"white");
                    alert("Straciłeś życie!");
                    if(this.life == 0){
                        alert("Przegrałeś!");
                        this.resetGame();
                    }else{
                        this.random = Math.floor(Math.random() * (this.sizeBoard));
                        this.view.lightSquare("s"+this.random,"#009900");
                    }
                }
            }
            time = time + 1000;
            this.timeToClick = this.timeToClick + 1000;
            this.checkEnd(time);
        },1000);
    }

    addClick(){
        for(let i = 0; i<this.sizeBoard;i++){
            let id = "s"+i;
            let board = document.getElementById(id);
            board.onclick = ()=>this.checkClick(id);
        }
    }

    removeClick(){
        for(let i = 0; i<this.sizeBoard;i++){
            let id = "s"+i;
            let board = document.getElementById(id);
            board.onclick = null;
        }
    }

    checkClick(id:string){
        this.removeClick();
        if("s"+this.random == id){
            this.score += 1;
            this.view.changeScore(this.score);
        }else{
            this.life -= 1;
            this.view.changeLife(this.life);
            alert("Straciłeś życie!");
            if(this.life == 0){
                alert("Przegrałeś!");
                this.resetGame();
            }
        }
        this.view.lightSquare("s"+this.random,"white");
        this.timeToClick = 1000;
    }

    resetGame(){
        clearInterval(this.refreshIntervalId);
        document.getElementById("start").disabled = false;
        document.getElementById("reset").disabled = true;
        this.life = 3;
        this.score = 0;
        this.view.changeLife(this.life);
        this.view.changeTime(0);
        this.view.changeScore(this.score);
        this.view.drawBoard(this.sizeBoard);
    }
    
}

let c = new Controller();
document.getElementById("start").onclick = ()=>{c.clickStart()};
document.getElementById("reset").onclick = ()=>{c.clickReset()};