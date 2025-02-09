const pRouter = require('./products.router'); // Products Router
const hRouter = require('./homes.router'); // Homes Router
const cartRouter = require('./cart.router'); // Cart Router
const checkoutRouter = require('./checkout.router'); // Check-out Router
const userRouter = require('./user.router'); // Homes Router
const searchRouter = require('./search.rotuer'); 

const subMenu = require('../../middleware/client/sub_menu.middleware');
const mincart = require('../../middleware/client/cart.middleware');
const auth = require('../../middleware/client/auth.middleware');
const userMiddleware = require('../../middleware/client/user.middleware');

module.exports = (app) => {
    app.use(subMenu.subMenu);
    app.use(userMiddleware.isLogin);
    app.use(mincart.index);
    
    app.use('/', hRouter);
    
    app.use('/products', pRouter);

    app.use(`/cart`, auth.isLogin, cartRouter);
    
    app.use(`/checkout`, auth.isLogin, checkoutRouter);

    app.use(`/user`, userRouter);

    app.use('/search', searchRouter);
}

  