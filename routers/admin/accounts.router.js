const express = require('express');
const router = express.Router();


const controller = require('../../controllers/admin/accounts.controller');
const multer  = require('multer');
const upload = multer();

const cloudUpload = require('../../middleware/admin/upload.middleware');
const validate = require('../../validate/admin/account.validate');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);


router.get('/create', controller.createAccount);
router.post('/create', upload.single('avatar'), validate.creatValidate, cloudUpload.cloudUpload, controller.createAccountPost);

router.get('/edit/:id', controller.editAccount);
router.patch('/edit/:id', upload.single('avatar'), validate.editValidate, cloudUpload.cloudUpload, controller.editAccountPatch);

router.get('/:id', controller.accountDetail);

module.exports = router;
