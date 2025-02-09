const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/user.controller');
const userValidate = require('../../validate/client/user.validate');
router.get('/login', controller.login);
router.post('/login', userValidate.login, controller.loginPost);

router.post('/register', userValidate.register, controller.registerPost);
router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgot);
router.post('/password/forgot', controller.forgotPost);

router.get('/password/otp', controller.otp);
router.post('/password/otp', controller.otpPost);

router.get('/password/reset', controller.reset);
router.post('/password/reset', userValidate.resetPassword, controller.resetPost);

// router.get('/delete/:product_id', controller.delete);
// router.post('/delete-all', controller.deleteAll);


module.exports = router;