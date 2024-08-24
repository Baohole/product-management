module.exports.isLogin = async (req, res, next) => {
    if(req.cookies.user_token){
        next();
    }
    else{
        res.redirect('/user/login');
    }
    
}