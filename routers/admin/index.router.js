const dRouter = require('./dashboard.router'); // Dashboard Router
const pRouter = require('./products.router'); // Products Router
const categoriesRouter = require('../../routers/admin/categories.router');
const rolesRouter = require('../../routers/admin/roles.router');
const accountsRouter = require('../../routers/admin/accounts.router');
const authRouter = require('../../routers/admin/auth.router');

const sysConfig = require('../../config/system');
const auth = require('../../middleware/admin/auth.middleware');
console.log(sysConfig);

module.exports = (app) => {
    const PATH_ADMIN = sysConfig.prefixAdmin;

    app.use(`${PATH_ADMIN}/dashboard`, auth.login, dRouter);
    
    app.use(`${PATH_ADMIN}/products`, auth.login, pRouter);

    app.use(`${PATH_ADMIN}/categories`, auth.login, categoriesRouter);

    app.use(`${PATH_ADMIN}/roles`, auth.login, rolesRouter);

    app.use(`${PATH_ADMIN}/accounts`, auth.login, accountsRouter);

    app.use(`${PATH_ADMIN}/auth`, authRouter);
}

  