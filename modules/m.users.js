var bcrypt      = require('bcryptjs');
const db        = require('../models')
const auth      = require('./m.auth');
module.exports ={
    signup:function(req,res,cb){
        var email       = req.body.email;
        var password    = req.body.password;
        var name        = req.body.name      
        
        db.users.findOne({ email: email }, function (err, data) {
            if (err) {
                cb("error",null);
            }
            else if(data === null) {
                bcrypt.hash(password, 8, function (err, hash) {
                    if (err) {
                        cb("error",null);
                    }
                    else {
                        db.users.create({
                            date: Math.floor(Date.now()/1000),
                            password: hash,
                            image: 'none',
                            name: name,
                            email:email
                        },function (err, data) {
                            if (err) {
                                cb("error",null)
                            }
                            else {
                                db.sessions.create({
                                    userid:data._id,
                                    expire:Math.floor(Date.now()/1000)+(60*60*24)
                                },function(err,sdata){
                                    if(err){
                                        cb("error",null);
                                    }else{
                                        console.log(sdata)
                                        cb(false,auth.genToken(sdata._id));
                                    }
                                    
                                });                         
                               
                            }
                        });
                    }
                });
            }
            else {
                cb("email",null)
            }
        });
    },
    login:function(req,res,cb){
        var email       = req.body.email;
        var password    = req.body.password;
        db.users.find({email:email},(err,data)=>{
            if(err){
                cb("error",null);
            }else{
                console.log('zzzzzzzzzzzzzzzzzzzz')
                console.log(data)
                if(data.length > 0){
                    bcrypt.compare(password, data[0].password, (err, resp)=> {
                        if(err){
                            cb("invalid",null);
                        }else{     

                            db.sessions.create({
                                userid:data[0]._id,
                                expire:Math.floor(Date.now()/1000)+(60*60*24)
                            },
                            function(err,sdata){
                                if(err){
                                    cb("error",null);
                                }else{
                                    cb(false,auth.genToken(sdata._id),data);
                                }
                                
                            });
                        }

                    });
                }else{
                    cb('invalid',null);
                }                
            }
        });
    },
    logout:function(req,res,cb){
        db.sessions.findOneAndDelete({_id:res.locals.user.sessionid}, function(err,data){
            if(err){
                cb("error",null);
            }else{
                cb(false,"sucess");
            }
        }) // executes
    },
    matchHistory:function(userid,cb){
        db.gameHistory.find({$or:[{wplayer:userid},{bplayer:userid}]}).populate('wplayer').populate('bplayer').exec(function(err,data){
            if(err){
                cb('err',null);
            }
            else{
                let his = data.map((d)=>{
                    date = new Date( d.startDate * 1000),
                        datevalues = [
                        date.getFullYear(),
                        date.getMonth()+1,
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes(),
                        date.getSeconds(),
                    ];
                    let duration = ((d.endDate-d.startDate)/60).toFixed(2);
                    return {
                        player : (userid.toString()==d.bplayer._id.toString())?d.wplayer.name:d.bplayer.name,
                        start : `${datevalues[0]}-${datevalues[1]}-${datevalues[2]} ${datevalues[3]}:${datevalues[4]}:${datevalues[5]}`,
                        duration:duration+"Min.",
                        win: (userid.toString()==d.winner.toString())?'win':'lose'
                    }
                })
                cb(false,his)
                // console.log(data);
            }
        })
    }
   
}