const Product = require('../../models/products.model');

const searchHelper = require('../../helper/search.helper');
const productHelper = require('../../helper/products.helper');

module.exports.index = async (req, res) => {
    const searchStatus = searchHelper(req.query);

    let pagination = {
        limitItems: 7,
        currentPage: 1,
        skip: 0
    }


    const find = {
        deleted: false,
        status: 'active'
    }
    // console.log(req.query);
    if (req.query.status) {
        find.status = req.query.status;
    }
    if (searchStatus.regex) {
        find.title = searchStatus.regex;
    }

    const sorted = {};
    if (req.query.sortVal) {
        sorted[req.query.sortKey] = req.query.sortVal;
    }
    else {
        sorted.position = 'desc';
    }
    //console.log(req.query.search_query);

    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }

    let total = await Product.countDocuments(find);
    pagination.totalPages = Math.ceil(total / pagination.limitItems);
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;
    //console.log(pagination.totalPages);

    let products = await Product.find(find)
        .limit(pagination.limitItems)
        .skip(pagination.skip)
        .sort(sorted);
    productHelper.newPrice(products);
    // console.log(products);
    res.render('client/pages/products/index.pug', {
        products: products,
        pagination,
        search_query: req.query.search_query
    })
}