var express = require('express');
var router = express.Router();
var msocket = require('../modules/m.socket');
var match = require('../modules/m.match');
var db = require('../models');

// initilizing match rooms in socket io and db
router.post('/search/:status', function(req, res) {
    if(res.locals.user.login ){
        
        if(req.params.status==='start'){
           match.startSearch(req.body.socketid,res.locals.user.data.userid,function(err, data){
               if(err){
                    res.status(422).json(err);
               }
               else{
                res.json(data);
               }
           });
        }
        else if(req.params.status==='end'){
            match.endSearch(res.locals.user.data.userid,function(err,data){
                if(err){
                    res.status(422).json(err);
                }else{
                    res.json(data);
                }
            })
           
        }
    }  
    else{
        res.status(403).json({"message":"invalid request"});
    }
});
router.patch('/skip',function(req,res){
    if(res.locals.user.login ){
        let room = req.body.room;
        match.skipPlayer(res.locals.user.data.userid,room,function(err,data){
            if(err){
                res.status(500).json(err);
            }else{
                res.json(data);
            }
        })
    }
    else{
        res.status(403).json({"message":"invalid request"});
    }
   
});
router.patch('/match/join',function(req,res){
    if(res.locals.user.login ){
        let room = req.body.room;
        let type = req.body.type;
        let socket = req.body.socektid;
        match.joinMatch(res.locals.user.data.userid,room,type,socket,function(err,data){
            if(err){
                res.status(500).json(err);
            }else{
                res.json(data);
            }
        })
    }
    else{
        res.status(403).json({"message":"invalid request"});
    }
   
});
router.put('/match/update',function(req,res){
    if(res.locals.user.login ){
        let room = req.body.room;
        let move = req.body.move;
        if(move.start.content.type==='w'){
            move.moveQue = 'black';
        }else{
            move.moveQue = 'white';
        }

        match.updateMatch(res.locals.user.data.userid,room,move,function(err,data){
            if(err){
                res.status(403).json(err);
            }else{
           
                msocket.io.to(room).emit('ongame',move)
                res.json('sucess');
            }
            
        })
    }
    else{
        res.status(403).json({"message":"invalid request"});
    }
   
});
router.post('/match/list',function(req,res){
    if(res.locals.user.login ){
        match.getCurrentMatches(function(err,data){
            if(err){
                res.status(500).json(err)
            }else{
                res.json(data);
            }
        })
    }
    else{
        res.status(403).json({"message":"invalid request"});
    }
});
router.post('/match/watch',function(req,res){
    if(res.locals.user.login){
       
        match.matchWatch(res.locals.user.data.userid,req.body.room,function(err,data){
            if(err){
                res.status(500).json(err);
            }else{
                res.json(data);
            }
        })
    }
});
router.post('/match/forfeit',function(req,res){
    if(res.locals.user.login){
      
        match.forfeit(res.locals.user.data.userid, req.body.room,function(err,data){
            if(err){
                res.status(500).json(err);
            }else{
                res.json(data);
            }
        })
    }
});
module.exports = router;
