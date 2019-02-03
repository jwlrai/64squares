var express     = require('express');
var router      = express.Router();
const user      = require('../modules/m.users');
const { check, validationResult } = require('express-validator/check');

router.post('/signup',[
        check('password').isLength({ min: 5 })
            .withMessage('password must be at least 5 chars long')
            .matches(/\d/).withMessage('password must contain a number'),
        check('email').isEmail().withMessage('invalid email'),
        check('name').matches(/^[0-9a-zA-Z\s]+$/).withMessage('name can be alpha numeric and space only'),
    ],  
    function(req, res) {
        
        if(!res.locals.user.login ){
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                let errorMessage = '';
                for(let i=0; i < errors.array().length;i++){
                    errorMessage = errorMessage + errors.array()[i].msg +'\r\n';
                }
                return res.status(422).json({ "message": errorMessage,"status":false });
            }
            if(req.body.password !== req.body.conpassword){
                return res.status(422).json({ "message": "Password is not matched","status":false });
            }
            user.signup(req,res,function(err,data){
                if(err == "error"){
                    return res.status(500).json({ "message": "Server error try later","status":false });
                }
                else if(err =='email'){
                    return res.status(422).json({ "message": "Email already exist","status":false });
                }
                else{
                    return res.append('x-token',data).json({"message":"User singnup sucessfully","status":true});
                }
            })
        }
        else{
            return res.status(403).json({"message":"invalid request",status:false});
        }
    }
);


router.post('/login',[
        check('password').isLength({ min: 5 }).matches(/\d/),
        check('email').isEmail()
    ],
    function(req,res){
        if(!res.locals.user.login ){
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({ "message": "Invalid email or password","status":false });
            }
            user.login(req,res,function(err,data,usr){
                
                if(err=='invalid'){
                    res.json({"message":"invalid email or passwordt",status:false});
                }
                else if(err=="error"){
                    res.json({"message":"invalid request",status:false});
                }else{
                    user.matchHistory(usr[0]._id,function(err,mdata){
                        let wins = 0;
                        for(let i=0; i < mdata.length; i++){
                            if(mdata[i].win==='win'){
                                wins++;
                            }
                        }

                        return res.append('x-token',data).json({"message":"User login sucessfully",data:{
                            name:usr[0].name,
                            win:wins,
                            game:mdata.length
                        },"status":true});
                    })
                    
                }

            })
            
        }
        else{
            return res.status(403).json({"message":"invalid request"});
        }
});
router.post('/logout',function(req,res){
    if(res.locals.user.login ){
        user.logout(req,res,function(err,data){
            if(err){
                return res.status(422).json({"message":"Invalid request",status:false});
            }
            else{
                return res.json({"message":"User logout sucessfully","status":true});
            }
        })
    }
    else{
        return res.status(403).json({"message":"invalid request"});
    }
})

router.post('/islogin',function(req,res){
    if(res.locals.user.login ){
        // return res.json({"status":true});
        user.matchHistory(res.locals.user.data.userid,function(err,mdata){
            let wins = 0;
            for(let i=0; i < mdata.length; i++){
                if(mdata[i].win==='win'){
                    wins++;
                }
            }

            return res.json({"message":"User login sucessfully",data:{
                name:res.locals.user.data.name,
                win:wins,
                game:mdata.length
            },"status":true});
        })
    }else{
        return res.status(422);
    }
});
router.get('/matchhistory',function(req,res){
    if(res.locals.user.login ){
     
        user.matchHistory(res.locals.user.data.userid,function(err,data){
            res.json(data)
        })
    }else{
        return res.status(400);
    }
});

module.exports = router;
