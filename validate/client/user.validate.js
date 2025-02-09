const User = require('../../models/user.model');

module.exports.register = async (req, res, next) => {
    const { full_name, password, email, confirm_password } = req.body;

    if (!full_name || !password || !email) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin')
        res.redirect('back');
        return;
    }
    const existAcc = await User.findOne({
        deleted: false,
        email: email
    });


    if (existAcc) {
        req.flash('error', 'Email đã tồn tại');
        res.redirect('back');
        return;
    }
    else if (password.length < 5) {
        req.flash('error', 'Mật khẩu phải có ít nhất 6 kí tự');
        res.redirect('back');
        return;
    }
    else if (password !== confirm_password) {
        req.flash('error', 'Mật khẩu xác nhận không chính xác');
        res.redirect('back');
        return;
    }

    next();

}

module.exports.login = async (req, res, next) => {
    const { password, email } = req.body;
    if (!password || !email) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin')
        res.redirect('back');
        return;
    }

    next();
}

module.exports.resetPassword = (req, res, next) => {
    const { password, confirm_password } = req.body;
    if (password.length < 5) {
        req.flash('error', 'Mật khẩu phải có ít nhất 6 kí tự');
        res.redirect('back');
        return;
    }
    else if (password !== confirm_password) {
        req.flash('error', 'Mật khẩu xác nhận không chính xác');
        res.redirect('back');
        return;
    }
    next();
}