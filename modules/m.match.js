const db = require('../models');
const shortid = require('shortid');
var msocket = require('../modules/m.socket');
const mongoose = require('mongoose');
module.exports = {

    preparePieces:function() {
        let assignPieces = {};

        var position = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        let condition = 17; let offset = 1;
        let typ = ['b', 'w'];

        for (let i = 1; i <= condition; i++) {
            if (i <= 8 || (i > 56 && i < 65)) {
                assignPieces['p' + i] = {
                    "pieces": position[(i - offset)],
                    "type": (i <= 8) ? typ[0] : typ[1],
                    "img": position[(i - offset)] + ((i <= 8) ? typ[0] : typ[1])
                }
            }
            else {
                assignPieces['p' + i] = {
                    "pieces": 'pawn',
                    "type": (i < 17) ? typ[0] : typ[1],
                    "img": "pawn" + ((i < 17) ? typ[0] : typ[1])
                }
            }
            if (i === 16) {
                i = 48; condition = 64; offset = 57;
            }
        }
        return assignPieces;
    },
    startSearch:function(socketid,userid,cb){
        var ths = this;
        db.pools.findOneAndUpdate({userid:{$ne:userid},opponentSocket:null},{opponentSocket:socketid},function(err,data){
            if(err){
                res.status(422).json({"message":"error founddd","status":false});
            }else{
                if(data==null){
                    db.pools.create({
                        userid:userid,
                        socketid:socketid,
                        quetime:Math.floor(Date.now()/1000),
                        opponentSocket:null
                    },function(err,data){
                        if(err){
                            cb({"message":"error found","status":false},null)
                        }else{
                            cb(false,{"message":"Searching game Started","status":true})
                        }
                    })
                }
                else{
                    db.pools.create({
                        userid:userid,
                        socketid:socketid,
                        quetime:Math.floor(Date.now()/1000),
                        opponentSocket:data.socketid
                    },function(err,sdata){
                        if(err){
                            cb({"message":"error found","status":false},null)
                        }else{
                            var room  = shortid.generate();
                            db.rooms.create({
                                name: room,
                                date: Math.floor(Date.now()/1000),
                                currentState:ths.preparePieces()
                            },(err,rdata)=>{
                                if(err){
                                    cb({"message":"error found","status":false},null)
                                }else{
                                    cb(false,{"message":"Searching game Started","status":true})
                                    //sending message back to opponent
                                    db.users.find({_id :{$in :[data.userid,userid]}},(err,udata)=>{
                                        if(err){
                                            cb({"message":"error found","status":false},null)
                                        }else{
                                           
                                            let players = { };
                                            for(let k=0; k < udata.length;k++){
                                                if(udata[k]._id.toString() == userid.toString()){
                                                    players['white'] = { name:udata[k].name,
                                                                        img:(udata[k].image=='none')?"questionmark.png":udata[k].image};
                                                }
                                                else if(udata[k]._id.toString() == data.userid.toString()){
                                                    players['black'] = { name:udata[k].name,
                                                        img:(udata[k].image=='none')?"questionmark.png":udata[k].image};
                                                }
                                            }
                                            
                                            msocket.io.to(data.socketid).emit('pool',{
                                                room:room,
                                                player:players,
                                                type:'black',
                                                userType:'player',
                                                // socket:socketid
                                            });
                                            //sending message back to curent player
                                            msocket.io.to(socketid).emit('pool',{
                                                room:room,
                                                player:players,
                                                type:"white",
                                                userType:'player'
                                                // socket:data.socketid
                                            });
                                        }
                                    })
                                    
                                    return;
                                }
                            })
                            
                        }
                    })
                   
                }
            }
        }) 
         
    },
    endSearch:function(userid,cb){
        db.pools.deleteMany({userid:userid},function(err,data){
            if(err){
                cb({"message":"error found","status":false},null)
            }else{
                cb(false ,{"message":"Searching game End","status":true});
            }
        })
    },
    skipPlayer : function(userid,room,cb){
        db.pools.findOne({userid:userid},function(err,data){
            if(err){
                cb({"message":"error found","status":false},null)
            }else{
                if(data!=null){
                    db.pools.findOneAndUpdate({userid:userid},{opponentSocket:null},function(err,odata){
                        db.pools.findOneAndUpdate({socketid:data.opponentSocket},{opponentSocket:null},function(err,pdata){
                            if(err){
                                cb({"message":"error found","status":false},null)
                            }else{
                                db.rooms.deleteOne({name:room },function (err) {
                                    if(err){
                                        cb({"message":"error found","status":false},null)
                                    }else{
                                        cb(false ,{"message":"Searching game Started","status":true});
                            
                                        msocket.io.to(data.opponentSocket).emit('pool',{skip:"skiped match"});
                                    }
                                });
                            }
                        })
                    });
                }
                else{
                    cb(false ,{"message":"Searching game Started","status":true});
                }
            }
        });
    },
    deletePool:function(socketid){
        let ths = this;
        db.pools.findOne({socketid:socketid},function(err,pdata){
            if(!err){
                if(pdata==null){
                    ths.declareWinner(socketid,function(err,data,type,room,lid){
                        msocket.io.to(room).emit('pool',{"winner":{id:data,type:type,lid}});
                    })
                }else{
                    db.pools.deleteOne({socketid:socketid},function(err,data){
                    })
                }
                
            }
        })
        
    },
    forfeit: function(userid,room ,cb){
        let ths  = this;
        db.rooms.findOne({name:room},function(err,data){
            if(err){
                cb({"message":"error found","status":false},null)
            }else{
                if(data==null){
                    cb({"message":"error found","status":false},null)
                }else{
                    let socket = (data.wplayer.toString()==userid.toString())?data.wsocket:data.bsocket;
                    ths.declareWinner(socket,function(err,data,type,room,lid){
                        if(!err){
                            msocket.io.to(room).emit('pool',{"winner":{id:data,type:type,lid:lid}});
                           
                            cb(false,{"message":"you forfieted the game"});
                        }
                    });
                }
            }

        });

    },
    declareWinner: (socketid,cb)=>{

        db.rooms.findOne({$or:[{wsocket:socketid},{bsocket:socketid}]}).populate('bplayer').populate('wplayer').exec(function(err,data){
            if(err){
                cb({"message":"error found","status":false},null)
            }else{
                if(data!=null){
                    db.gameHistory.create({
                        roomName:data.name,
                        startDate: data.date,
                        endDate:Math.floor(Date.now()/1000),
                        bplayer:data.bplayer._id,
                        wplayer:data.wplayer._id,
                        moves:data.steps,
                        winner:(data.wsocket==socketid)?data.bplayer._id:data.wplayer._id
                    },function(err,hdata){
                        if(err){
                            cb({"message":"error found","status":false},null)
                        }else{
                            let winnerSocket = (data.wsocket==socketid)?data.bsocket:data.wsocket;
                            let loserSocket = (data.wsocket==socketid)?data.wsocket:data.bsocket;
                            let type =(data.wsocket==socketid)?data.bplayer.name:data.wplayer.name;
                            db.rooms.findByIdAndDelete(data._id,function(err,ddata){
                                if(!err){
                                    cb(false,winnerSocket,type,data.name,loserSocket);
                                }
                                else{
                                    cb({"message":"error found","status":false},null)
                                }
                                
                            })
                            
                        }
                    })
                }else{
                    cb({"message":"error found","status":false},null)
                }
            }
           
        });
    },
    joinMatch: (userid,room,type,socketid,cb) => {
        db.pools.deleteMany({userid:userid},function(err,data){
            if(err){
                cb({"message":"error found","status":false},null);
            }else{
                let updateData =(type=='black')? {"bplayer": mongoose.Types.ObjectId(userid),"bsocket":socketid } : {"wplayer": mongoose.Types.ObjectId(userid),"movePlayer":mongoose.Types.ObjectId(userid),"wsocket":socketid };
                db.rooms.updateOne({"name":room},{ $set : updateData},function(err,udata){
                    if(err){
                        
                        cb({"message":"error found","status":false},null);
                    }else{
                        if(udata==null){
                            cb({"message":"unable to join game","status":false},null);
                        }else{
                            cb(false,{"message":"Game join sucessfully","status":true});
                            
                        }  
                    }
                })
            }
        });

    },
    leaveRoom: (room,userid,game,cb) => {
        let joinRooms = [];
        db.userRoom.find({"userid":userid},function(err,cdata){
            if(!err){
                db.userRoom.deleteMany({"userid":userid},function(err,ddata){
                    for(let i=0; i < cdata.length; i++){
                        joinRooms.push(cdata[i].room);
                    }
                    db.userRoom.create({userid:userid,room:room,game:false,date:Math.floor(Date.now()/1000)}
                    ,function(err,cdata){
                        if(!err){
                            
                        }else{
                            cb(false,joinRooms);
                        }
                    })
                });
            }else{
                cb(true,null);
            }
        })
           
       
    },
    updateMatch: (userid,room, movesMade,cb) => {
        let moves ={
            start:{
                move:movesMade.start.move,
                content:Object.assign(movesMade.start.content)
            },
            end:{move:Object.assign(movesMade.end.move)},
            removed:Object.assign(movesMade.removed)
        }
        
        db.rooms.findOne({name:room},(err,data)=>{
            
            if(err){
                cb({"message":"error found"},null);
            }else{
                if(data.movePlayer.toString() === userid.toString()){
                    if(userid.toString()=== data.bplayer.toString()){
                        moves.start.move = 'p'+(65-parseInt(moves.start.move.substring(1)));
                        moves.end.move = 'p'+(65-parseInt(moves.end.move.substring(1)));
                    }
                    let currentState = Object.assign(data.currentState);
                    delete currentState[moves.start.move];
                    currentState[moves.end.move] = moves.start.content;
                    let steps = data.steps.slice();
                    steps.push(moves);
                    let updateData = {};
                    updateData.currentState = currentState;
                    updateData.movePlayer = (data.bplayer.toString()=== userid.toString())?data.wplayer:data.bplayer;
                    updateData.steps = steps
                    db.rooms.findOneAndUpdate({name:room},updateData,function(err,udata){
                        cb(false,{"message":"sucesss"});
                    });
                }else{
                    
                    cb({"message":"invalid move found"},null);
                }
            }
        });

    },
    getCurrentMatches :(cb)=>{
        db.rooms.find().populate('bplayer').populate('wplayer').sort({'date':-1}).limit(10).exec(function(err,data){
            if(err){
                cb({"message":"error found"},null);
            }
            else{
                let mdata = [];
                for(let i=0; i < data.length;i++){
                    if(data[i].bplayer!= undefined && data[i].wplayer != undefined){
                        mdata.push({
                            "bplayer":{
                                        name:data[i].bplayer.name,
                                        img:(data[i].bplayer.image=='none')?"questionmark.png":data[i].bplayer.image
                                      },
                            "wplayer":{
                                        name:data[i].wplayer.name,
                                        img:(data[i].wplayer.image=='none')?"questionmark.png":data[i].wplayer.image
                                      },
                            "room":data[i].name,
                            "gamestate":data[i].currentState
                        })
                    }
                }
                
                cb(false,mdata);

            } 

        });
    },
    matchWatch : (userid,room,cb)=>{
       
        db.rooms.findOne({name:room},function(err,data){
            if(err){
                cb({"message":"error found"},null);
            }else{
                if(data == null){
                    cb({"message":"error found"},null);
                }else{
                    cb(false,{
                        room:data.name,
                        gameState:data.currentState
                    });
                }
                
            }
        })
    }
}