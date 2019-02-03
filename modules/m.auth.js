var db          = require('../models');
var bcrypt      = require('bcryptjs');
var jwt         = require('jsonwebtoken');
module.exports ={
    secretKey:'Cf_o&{hTbi}oyzLFmk5Khq(wrrh*D1Cf_o&{hTbi}oyzLFmk5Khq(w123e',
    validateLogin:(email,password,cb)=>{       
        db.users.findOne({ email: email }, function (err,data) {
            
            if(err){
                cb('internal error',null);
            }
            else{
                if(data==null){
                    cb('invalid',null)
                }
                else{
                    bcrypt.compare(password, data.password).then((res) => {
                        if(res===false){
                            cb('invlaid',null);
                        }
                        else{
                            cb(false,data)
                         
                        }
                    });
                }
                
            }
        });

    },
    genToken:function(data){
        return jwt.sign({ data: data }, this.secretKey);
    },
    getIdFromToken(token,cb){    
        jwt.verify(token, this.secretKey, function(err, data) {
            if(err){
                cb("error",null);
            }
            else{
                cb(false,data);
            }
        });
    },
    verifySession(id,cb){
        db.sessions.findOne({ _id: id }).populate('userid').exec(function (err,data) {
            if(err){
                cb('error',null);
            }
            else if(data == null){
                cb('invalid',null);
            }
            else{
                
                if(data.expire < Math.floor(Date.now()/1000)){
                    cb('expire',null);
                }else{
                    cb(false,{
                        sessionid:id,
                        userid:data.userid[0]._id,
                        name:data.userid[0].name,
                        email:data.userid[0].email,
                    })
                }
            }
        });
    }
}