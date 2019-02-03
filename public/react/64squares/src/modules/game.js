 class Game {
    
    constructor(obj){
        
        if(obj.id===undefined || obj.id.replace(/\s/g,'') === ''){
            throw new Error('There is no element is selected');
        }
        if(!["player","audience"].includes(obj.userType)){
            throw new Error('User type must be defined');
        }
        if((obj.userType==='player') && (obj.detailId===undefined || obj.detailId.replace(/\s/g,'') === '')){
            throw new Error('There is no element is selected for player detail');
        }
        
        if( obj.userType==="audience" && (obj.assignPieces === undefined || typeof(obj.assignPieces)!=='object') ){
            throw new Error('Audience must have moved peices steps');
        }        
        
        if(!['black','white'].includes(obj.type)){
            throw new Error('There is no element is selected');
        }
      
        this.prevBack   = null;
        this.blackColor ='grey'
        this.whiteColor ='white';
        this.moveQue    =(obj.type==='black')?false:true; // this show your move turn or not
        this.startMove  = null; // this is the selected piece position
        this.removedPieces = {
            "b":[],
            "w":[]
        }
        this.pieces = {
            "pawn"  : ["forward"],
            "knight": ["lshape"],
            "bishop": ["cross"],
            "rook"  : ["straight"],
            "queen" : ["straight","cross"],
            "king"  : ["straight","cross"]
            
        };
        
        this.assignPieces   = ( obj.userType==="audience")?obj.assignPieces:{};
        this.type           = obj.type; // this is selected site color eg black, white.
        this.element        = document.getElementById(obj.id); // element where chess bord is rederd
        this.playerElement  = document.getElementById(obj.detailId); // element where user name and removed pices rendered
        this.element.style.cssText = 'max-width:600px;max-height:650px; width:100%;display:flex;flex-direction: row;flex-wrap: wrap;';
        this.moveStatus = false; // this show your move turn or not
        this.playerObj = obj.player;
        this.userTYpe = obj.userType;
        this.cb = null;
        
    }
    checkMate = function(){
        let stype = (this.type==='black')?'b':'w';
        let otype = (this.type==='black')?'w':'b';
        let keys = Object.keys(this.assignPieces);
        for(let i=1; i < keys.length; i++){
            if(this.assignPieces[keys[i]].type===stype && this.assignPieces[keys[i]].pieces==='king'){
                let startPos = parseInt(keys[i].substring(1));
                let crosMoves = this.moves.cross(startPos);
     
                for(let j=0; j < crosMoves.length; j++){
                    for(let k=0; k < crosMoves[j].length; k++){
                       
                        if(this.assignPieces['p'+crosMoves[j][k]]!== undefined){
                            if(this.assignPieces['p'+crosMoves[j][k]].type===otype && ( 
                                this.assignPieces['p'+crosMoves[j][k]].pieces==='queen' || 
                                this.assignPieces['p'+crosMoves[j][k]].pieces==='bishop' || 
                                (k===0 && this.assignPieces['p'+crosMoves[j][k]].pieces==='pawn')|| 
                                (k===0 && this.assignPieces['p'+crosMoves[j][k]].pieces==='king')) 
                            ){
                                return true;
                            }
                            else{
                                break;
                            }
                        }
                        
                    }
                }
                let straightMoves = this.moves.straight(startPos);
                for(let j=0; j < straightMoves.length; j++){
                    for(let k=0; k < straightMoves[j].length; k++){
                        if(this.assignPieces['p'+straightMoves[j][k]]!== undefined){
                            if(
                                this.assignPieces['p'+straightMoves[j][k]].type===otype && (
                                    this.assignPieces['p'+straightMoves[j][k]].pieces==='queen' || 
                                    this.assignPieces['p'+straightMoves[j][k]].pieces==='rook' || 
                                   (k===0 && this.assignPieces['p'+straightMoves[j][k]].pieces==='king')) 
                            ){
                                return true;

                            }else{
                                break;
                            }
                        }
                        
                    }
                }
                let lshape = this.moves.lshape(startPos);
                for(let j=0; j < lshape.length; j++){
                    for(let k=0; k < lshape[j].length; k++){
                        if(this.assignPieces['p'+lshape[j][k]]!== undefined){
                            if(
                                this.assignPieces['p'+lshape[j][k]].type===otype && 
                                this.assignPieces['p'+lshape[j][k]].pieces==='knight'
                            ){
                                return true;
                            }
                        }
                    }
                }
               
            }
        }
        // return false;
    }
    start = function(cb){
        this.cb = cb;
        if(this.userTYpe ==='player'){
            this.startPiecesPosition();
        }
        this.createBox(cb);       
        this.renderPeices();
        if(this.userTYpe === 'player'){
            this.createDetailBox();
        }
        
    }
    changeMoveStatus = function(status){
        this.moveQue = status;
    }
    startPiecesPosition = function(){// intilizing pieces placeses in board
        var startPosition = {
                'white':['rook','knight','bishop','queen','king','bishop','knight','rook'],
                'black':['rook','knight','bishop','king','queen','bishop','knight','rook']
        }
        var position =  startPosition[this.type];

        let condition   = 17; let offset = 1;
        let typ = (this.type ==='black')?['w','b']:['b','w'];
        
        for(let i=1; i <= condition; i++){
            if(i <= 8 || (i > 56 && i < 65) ){
                this.assignPieces['p'+i ] = {
                    "pieces":position[(i-offset)],
                    "type":(i<=8)?typ[0]:typ[1],
                    "img":position[(i-offset)] + ((i<=8)?typ[0]:typ[1])
                }
            }
            else{
                this.assignPieces['p'+i] = {
                    "pieces":'pawn',
                    "type":(i<17)?typ[0]:typ[1],
                    "img":"pawn"+ ((i<17)?typ[0]:typ[1])
                }
            }
            if(i===16){
                i=48; condition = 64; offset=57;
            }
        }
    }
    getCoordinate = function(position){
        for(let i=1; i <9;i ++){
            if(position<(8*i)+1){
                return [position-((i-1)*8),i];
            }
        }
    }
 
    verifyMove = function(start,end,type){
        
        
        let startPiec = this.assignPieces[start];
        let startPosi = parseInt(start.substring(1));
        let endPosi = parseInt(end.substring(1));
        let moveTyp =  this.pieces[startPiec.pieces];
        
        let totalMoves = [];
        for(let i = 0; i < moveTyp.length; i++ ){
            let subMove = [];
            if(startPiec.pieces === 'pawn' ){    
                subMove = this.moves[moveTyp[i]](startPosi);// get forward logic
                if(subMove[0].includes(endPosi) && type==="remove"){
                    return false; //don't let pawn to kill opponent in forward move
                }
                else if(!subMove[0].includes(endPosi) && type==="remove"){// this is cross move
                    subMove =  this.moves['pawncross'](startPosi);
                    if(subMove[0].includes(endPosi)){ // if crosss move content endpostion return no need futher calculations
                        return true;
                    }
                }
                
            }else{                
                subMove = this.moves[moveTyp[i]](startPosi);
                if(startPiec.pieces==='king'){
                    for(let j=0; j < subMove.length;j++){
                        subMove[j] = [subMove[j][0]];
                    }
                }
            }
            if(subMove.length>0) totalMoves = totalMoves.concat(subMove);
        }
        //verifying if the moves is coreect or not
        var indx = null;
        for(let i=0; i < totalMoves.length;i++){
            if(totalMoves[i].includes(endPosi)){
                indx = i;
            }
        }
       
        if(indx === null) return false;

        // verify if there is obstacle in path or not
        if(startPiec.pieces !== 'knight'){
            let i=0;
            let indxOfEndPosi = totalMoves[indx].indexOf(endPosi);
            if(indxOfEndPosi > 0){ // if enemy is in next step or next step is in next possible step than dont neeed to calculate 
                while((type==='new')?i <= indxOfEndPosi:i<indxOfEndPosi){
                    if(this.assignPieces['p'+totalMoves[indx][i]]){
                        return false
                    }
                    i++;
                }
            }
        }
        return true;
    }
    moves = {// return the array of possible move
        boundry         : [1,2,3,4,5,6,7,8,16,24,32,40,48,56,64,63,62,61,60,59,58,57,49,41,33,25,17,9],
        corner          : [57,8,64,1],
        leftBoundry     : [49,41,33,25,17,9],
        rightBoundry    : [16,24,32,40,48,56],
        topBoundry      : [2,3,4,5,6,7],
        bottomBoundry   : [63,62,61,60,59,58],

        cross : function(start){
            let moves = []; let process = [-7,7,-9,9]; let validProcess = [];
            if(this.leftBoundry.includes(start)) validProcess = [-7,9]; 
            else if(this.rightBoundry.includes(start)) validProcess = [7,-9];   
            else if(this.topBoundry.includes(start)) validProcess = [7,9];  
            else if(this.bottomBoundry.includes(start)) validProcess = [-7,-9];  
            else if(this.corner.includes(start)) validProcess = [process[this.corner.indexOf(start)]];  

            for(let i=0; i < process.length; i++){
                let startPosition = start; var temMove = [];
                if(this.boundry.includes(start)){// if selected pieces in boundry
                    if(validProcess.includes(process[i])){
                        do{                        
                            startPosition = startPosition+ process[i];
                            temMove.push(startPosition);
                        }while(!this.boundry.includes(startPosition))
                    }
                }
                else{
                    while(!this.boundry.includes(startPosition)){                        
                        startPosition = startPosition+ process[i];
                        temMove.push(startPosition);
                    }
                }
                if(temMove.length > 0) moves.push(temMove);
            }
            return moves;
        },
        straight : function(start){
            let moves = []; let process = [-1,1,-8,8]; let validProcess = [];
            let maxBoundry = [];
            if(start === 1 ){
                validProcess = [1,8];  maxBoundry = [8,57];
            } 
            else if(start === 8 ){
                validProcess = [8,-1];  maxBoundry = [1,64];
            } 
            else if(start === 64 ){
                validProcess = [-1,-8];  maxBoundry = [8,57];
            }
            else if(start === 57 ){
                validProcess = [1,-8]; maxBoundry = [1,64];
            } 
            else if(this.leftBoundry.includes(start)){
                validProcess = [8,-8,1]; maxBoundry = [1,57,(start+7)]
            }
            else if(this.rightBoundry.includes(start)){
                validProcess = [8,-8,-1]; maxBoundry = [8,64,(start-7)]
            } 
            else if(this.topBoundry.includes(start)){
                validProcess = [1,-1,8]; maxBoundry = [1,8,(start+(8*7))]
            } 
            else if(this.bottomBoundry.includes(start)){
                validProcess = [1,-1,-8]; maxBoundry = [57,64,(start-(8*7))]
            } 
            for(let i=0; i < process.length;i++){
                let startPosition = start; var temMove = [];
                if(this.boundry.includes(start)){ // if selected pieces in boundry
                    if(validProcess.includes(process[i])){
                        do{                        
                            startPosition = startPosition+ process[i];
                            temMove.push(startPosition);
                        }while(!maxBoundry.includes(startPosition))
                    }
                }
                else{                
                    
                    do{                        
                        startPosition = startPosition+ process[i];
                        temMove.push(startPosition);
                    }while(!this.boundry.includes(startPosition))
                    
                }
                if(temMove.length > 0) moves.push(temMove);
            }
            return moves;
        },
        lshape:(start)=>{
            let process = [[1,16],[1,-16],[-1,16],[-1,-16],[8,2],[8,-2],[-8,2],[-8,-2]];
            let moves = [];
            let startCordinate = this.getCoordinate(start);
            for(let i=0; i< process.length; i++){                
                let move = start + process[i][0] +process[i][1];
                if(move > 0 && move < 65 && (start + process[i][0]) > 0 ){
                   
                    let temCor = this.getCoordinate(move);
                  
                    if( Math.abs(startCordinate[0]-temCor[0]) < 3 && Math.abs(startCordinate[1]-temCor[1]) < 3){
                        moves.push(move);
                    }
                    
                }
            }
            return [moves];
        },
        forward:(start)=>{
            if([49,50,51,52,53,54,55,56].includes(start)){
                return [[(start-8),(start-16)]];
            }
            else{
                return [[start-8]];
            }
        },
        pawncross: function(start){
            let moves = [];  let validProcess = [];
            
            if( this.leftBoundry.includes(start)) validProcess = [[1,-8]];
            else if( this.rightBoundry.includes(start)) validProcess = [[-1,-8]];
            else validProcess = [[-1,-8],[1,-8]];
            for(let i=0; i < validProcess.length; i++){
                moves.push(start + validProcess[i][0] + validProcess[i][1])
            }
            return [moves];
        }
    }
    handleEvent = (e,cb)=>{
        e.stopPropagation();
        if(this.moveQue===true){
            let tg = e.target;
            if(tg.className === ''){ // has pieces;
                var parent = tg.parentNode;
                let detail = this.assignPieces[parent.className];
            
                if(this.type.charAt(0) === detail.type){ // piece of same side
                    if(this.startMove !== null){
                        document.getElementsByClassName(this.startMove)[0].style.backgroundColor = this.prevBack;
                    }
                    this.startMove = parent.className;
                    this.prevBack = parent.style.backgroundColor;
                    parent.style.backgroundColor = '#9ec157';                
                }
                else{ // if it is others side piece
                    if(this.startMove!==null){
                        //verify move
                        if(this.verifyMove(this.startMove,parent.className,'remove')){
                            let removedPieces = this.assignPieces[parent.className];
                            tg.remove();
                            parent.appendChild(document.getElementsByClassName(this.startMove)[0].childNodes[0]);
                            // tracking removed piece
                            this.removedPieces[this.assignPieces[parent.className].type].push(this.assignPieces[parent.className] );
                            this.assignPieces[parent.className] = this.assignPieces[this.startMove];
                            delete this.assignPieces[this.startMove];
                            document.getElementsByClassName(this.startMove)[0].style.backgroundColor = this.prevBack;
                            this.prevBack = null;
                            if(this.checkMate()){
                                cb('checkmate');
                            }
                            else{
                                let objs= {
                                    start:{
                                        move:this.startMove,
                                        content:this.assignPieces[parent.className]
                                    },
                                    end :{
                                        move:parent.className,
                                       
                                    },
                                    removed:{
                                        content:removedPieces
                                    }
                                };
                                cb(objs);
                                if(this.userTYpe==='player'){
                                    this.renderDetails(objs);
                                }
                            }
                            
                            this.startMove = null;
                            
                            

                        }
                    }
                }
            }else{
                if(this.startMove!==null){
                    if(this.verifyMove(this.startMove,tg.className,'new')){
                        tg.appendChild(document.getElementsByClassName(this.startMove)[0].childNodes[0]);
                        document.getElementsByClassName(this.startMove)[0].style.backgroundColor = this.prevBack;
                        
                        // update assignpieces
                        Object.defineProperty(this.assignPieces, tg.className,
                            Object.getOwnPropertyDescriptor(this.assignPieces, this.startMove));
                        delete this.assignPieces[this.startMove];
                        this.prevBack = null;
                        if(this.checkMate()){
                            cb('checkmate');
                        }
                        else{
                            cb({
                                start:{
                                    move:this.startMove,
                                    content:this.assignPieces[tg.className]
                                },
                                end :{
                                    move:tg.className
                                },
                                removed:{

                                }
                            });
                        }
                        this.startMove = null;
                    }
                }
            }
        }
    }
    renderPeices = function (){
        var keys = Object.keys( this.assignPieces);
        for(let i=0; i < keys.length; i++){
            var img = document.createElement("img"); 
            img.src = `/images/chess/${this.assignPieces[keys[i]].img}.png`;
            img.style.cssText = 'width:100%;height:100%;padding:12%;'
            document.getElementsByClassName(keys[i])[0].appendChild(img);
        }
    }
    renderDetails = function(obj){
        
        var child = document.getElementsByClassName((obj.removed.content.type==="w")?'piecesFieldb':'piecesFieldw')[0].children;
        for(let i=0; i < child.length; i++){
            if(child[i].children[0].nodeName.toLowerCase() ==='p'){
                child[i].children[0].remove();
                let img = document.createElement('img');
                img.src = `/images/chess/${obj.removed.content.img}.png`;
                img.style.cssText = "width:100%; height:100%;"
                child[i].append(img);
                return;
            }
        }
    }
    handleEventMove = (e)=>{
        this.handleEvent(e,this.cb)
    }
    createBox = function (cb){
        
        var squareLength = this.element.clientWidth*.12;
        var color = [this.blackColor,this.whiteColor];
        for(let i =1; i <= 64; i++){
            var square = document.createElement("div"); 
            if(this.userTYpe==='player'){
                square.addEventListener('click',this.handleEventMove);
            }
            square.className = 'p'+i;
            square.style.cssText = `height:${squareLength}px;width:${squareLength}px;border:1px solid black;background-color:${color[i%2]}`;    
            // square.textContent = i;
            this.element.appendChild(square);  
            if(i%8===0){
                color.reverse();
            }
            square = null;
        }
    }
    createDetailBox = function(){
        this.playerElement.style.cssText = ' max-width: 280px;min-height: 220px;padding:25px 10px;';
        for(let j=0;j < 2;j++){
            let playerDetail = document.createElement('div');
            playerDetail.style.cssText = `width:100%;`;
            let playerImage = document.createElement('div');
            // playerImage.style.cssText = ''
            let playerName = document.createElement('h5')
            
            playerName.style.cssText='text-align: center;';
            let piecesField = document.createElement('div');
            if(j===1){
                let imgName = (this.type==='black')?this.playerObj['black'].img:this.playerObj['white'].img;
                playerName.textContent = `Player : ${(this.type==='black')?this.playerObj['black'].name:this.playerObj['white'].name}`;
                playerImage.style.cssText = `background-image:url(/images/chess/${imgName});background-repeat:no-repeat;background-size:100% 100%;width:100px;height: 100px; border:1px solid #d1d1d1;margin:0 auto;`
                
                piecesField.style.cssText = 'width:100%; height: auto;display: flex;flex-flow: row;flex-wrap: wrap-reverse;justify-content: space-between;';
            }else{
                let imgName = (this.type==='black')?this.playerObj['white'].img:this.playerObj['black'].img;
                piecesField.style.cssText = 'width:100%; height: auto;display: flex;flex-flow: row;flex-wrap: wrap;justify-content: space-between;';
                playerName.textContent = `Player : ${(this.type==='black')?this.playerObj['white'].name:this.playerObj['black'].name}`;
                playerImage.style.cssText = `background-image:url(/images/chess/${imgName});background-repeat:no-repeat;background-size:100% 100%;width:100px;height: 100px; border:1px solid #d1d1d1;margin:0 auto;`
            }
            
            for(let i=1; i <=16;i++){
                let pieces = document.createElement('div');
                pieces.style.cssText = 'width:41px; height:41px;border:1px solid black;margin-bottom:2px; text-align:center';
                pieces.innerHTML = '<p>'+i+'</p>';
                piecesField.append(pieces);
            }
            if(j===0){
                playerDetail.append(playerImage);
                playerDetail.append(playerName);
                playerDetail.append(piecesField);
                piecesField.className = (this.type==="black")?"piecesFieldw":"piecesFieldb"
                playerImage.className = (this.type==="black")?"imgw":"imgb";
               
            }else{
                playerDetail.append(piecesField);
                playerDetail.append(playerName);
                playerDetail.append(playerImage);
                piecesField.className = (this.type==="black")?"piecesFieldb":"piecesFieldw"
                playerImage.className = (this.type==="black")?"imgb":"imgw";
            }
            
            this.playerElement.append(playerDetail);
            if(j===0){
                let breakLine = document.createElement('div');
                breakLine.style.cssText ='border:2px solid #d1d1d1;width:60%;margin:25px auto;';
                this.playerElement.append(breakLine);
            }
        }
    }
    renderOpponentMove = function(moves){
        var types = {"white":"w","black":"b"};
        if(moves.start.content.type!== types[this.type]){

            var startMove = 65-parseInt(moves.start.move.substring(1));
            startMove = 'p'+startMove;
           
            var startEle = document.getElementsByClassName(startMove);
            var endMove = 65-parseInt(moves.end.move.substring(1));
            endMove = 'p'+endMove;
            var endELe = document.getElementsByClassName(endMove);
            
            if(endELe[0].childNodes.length > 0){
                endELe[0].childNodes[0].remove();

                this.renderDetails({removed:{content:this.assignPieces[endMove]}});
            }
            // let opponentType ={"w":"b","b":"w"};
            let startContent = this.assignPieces[startMove];
            this.assignPieces[endMove] = startContent;
            delete this.assignPieces[startMove];
            endELe[0].appendChild(startEle[0].childNodes[0]);
        }
    }
    renderMove = function(moves){
        var types = {"white":"w","black":"b"};
        var startMove =(moves.start.content.type!== types[this.type])? 65-parseInt(moves.start.move.substring(1)):parseInt(moves.start.move.substring(1));
        startMove = 'p'+startMove;
        
        var startEle = document.getElementsByClassName(startMove);
        var endMove = (moves.start.content.type!== types[this.type])?65-parseInt(moves.end.move.substring(1)):parseInt(moves.end.move.substring(1));
        endMove = 'p'+endMove;
        var endELe = document.getElementsByClassName(endMove);
        
        if(endELe[0].childNodes.length > 0){
            endELe[0].childNodes[0].remove();
        }
        // let opponentType ={"w":"b","b":"w"};
        let startContent = this.assignPieces[startMove];
        this.assignPieces[endMove] = startContent;
        delete this.assignPieces[startMove];
        endELe[0].appendChild(startEle[0].childNodes[0]);
        
    }
    destory = function(){
        if(this.userTYpe==='player'){
            for(let i=0; i < 64; i++){
                this.element.children[i].removeEventListener("click", this.handleEventMove);
            }
            this.element.innerHTML ='';
            this.element.detailId ='';
        }else{
            this.element.innerHTML ='';
        }
    }    
};

export default Game;