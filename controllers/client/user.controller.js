const User = require('../../models/user.model');
const Cart = require('../../models/cart.model');
const OTP = require('../../models/OTP.model');

const md5 = require('md5');
const jwt = require('jsonwebtoken');

const createOTP = require('../../helper/creatOTP.helper');
const sendMail = require('../../helper/sendMail.helper');

//[GET] /user/login
module.exports.login = (req, res) => {
    res.render('client/pages/user/login', {
        pageTitle: 'Đăng nhập',
    });
}

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            email: email,
            password: md5(password)
        });
        if (user) {
            const cart = await Cart.findOne({
                user_id: user.id
            });
            if (req.body.remember) {
                const maxAge = 1000 * 60 * 60 * 24 * 365
                res.cookie('user_token', user.user_token, { maxAge: maxAge });
                res.cookie('cart_id', cart.id, { maxAge: maxAge });
            }
            else {
                res.cookie('cart_id', cart.id);
                res.cookie('user_token', user.user_token);
            }

            res.redirect('/');
        }
        else {
            req.flash('error', "Sai tài khoản hoặc mật khẩu");
            res.redirect('back');
            return;
        }

    } catch (error) {
        req.flash('error', "Đăng nhập thất bại");
        res.redirect('back');
        return;
    }

}

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
    req.body.password = (md5(req.body.password));
    req.body.user_token = jwt.sign(req.body.email, process.env.JWT_SECRECT);
    try {
        const user = new User(req.body);
        await user.save();
        res.cookie('user_token', user.user_token);

        const data = {
            user_id: user.id,
        }
        const newCart = new Cart(data);
        await newCart.save();
        res.cookie('cart_id', newCart.id);


        res.redirect('/');
    } catch (error) {
        req.flash('error', "Tạo tài khoản thất bại!!");
        res.redirect('back');
    }
}

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('user_token');
    res.clearCookie('cart_id');
    res.redirect('/');
}

//[GET] /user/password/forgot
module.exports.forgot = (req, res) => {
    res.render('client/pages/user/forgot', {
        pageTitle: 'Lấy lại mật khẩu',
    });
}

//[POST] /user/password/forgot
module.exports.forgotPost = async (req, res) => {
    const email = req.body.email;
    const isExist = await User.findOne({
        email: email,
        deleted: false
    });
    if (!isExist) {
        req.flash('error', "Email không tồn tại!!");
        res.redirect('back');
        return;
    }
    const otp = createOTP.createOTP(6);
    const data = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const newOTP = new OTP(data);
    await newOTP.save();

    const subject = 'Mã OTP xác minh mật khẩu';
    const message = `
            Mã OTP của bạn là: <b>${otp}</b>
            Vui lòng không để lộ mã này.`;
    sendMail(email, subject, message)
    res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otp = (req, res) => {
    const email = req.query.email;

    res.render('client/pages/user/otp', {
        pageTitle: 'Nhập mã OTP',
        email: email
    });
    //res.send('ok');
}

//[POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
    console.log(req.body);
    const existOtp = await OTP.findOne({
        email: req.body.email,
        otp: req.body.otp,
    });
    if (!existOtp) {
        req.flash('error', "Mã OTP không tồn tại!!");
        res.redirect('back');
        return;
    }

    const user = await User.findOne({
        email: req.body.email
    });
    res.cookie('user_token', user.user_token);

    res.redirect('/user/password/reset');
}

//[GET] /user/password/reset
module.exports.reset = (req, res) => {
    res.render('client/pages/user/reset', {
        pageTitle: 'Nhập mật khẩu'
    });
    //res.send('ok');
}

//[POST] /user/password/reset
module.exports.resetPost = async (req, res) => {
    //console.log(req.cookies.u)
    await User.updateOne({
        user_token: req.cookies.user_token
    }, {
        password: md5(req.body.password)
    });
    res.redirect('/');
}
