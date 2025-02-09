const Order = require('../../models/orders.model');
const Product = require('../../models/products.model');

module.exports.index = async (req, res) => {
    const orders = await Order.find();
    let metadata = {
        totalOrder: {
            count: 0,
            progress: 0,
        },
        totalClaim: {
            count: 0,
            progress: 0,
        },
    };
    const productSales = new Map();
    const monthlyClaim = new Map([
        ['January', 0], ['February', 0], ['March', 0],
        ['April', 0], ['May', 0], ['June', 0],
        ['July', 0], ['August', 0], ['September', 0],
        ['October', 0], ['November', 0], ['December', 0]
    ]);

    const thisYear = new Date(Date.now());
    let preTotalOrder = 0;
    let preTotalClaim = 0;
    orders.forEach(order => {
        const orderDate = new Date(order.order_date);
        const monthName = orderDate.toLocaleString('default', { month: 'long' });
        const yearGap = thisYear.getFullYear() - orderDate.getFullYear();
        if (yearGap === 0) {
            monthlyClaim.set(monthName, monthlyClaim.get(monthName) + order.totalPrice);
            metadata.totalOrder.count += order.products.length;
            metadata.totalClaim.count += order.totalPrice;
        }
        else if (yearGap === 1) {
            preTotalOrder += order.products.length;
            preTotalClaim += order.totalPrice;
        }

        // best selling analysis
        order.products.forEach(product => {
            const { product_id, quantity } = product;

            // Update product sales count
            if (productSales.has(product_id)) {
                productSales.set(
                    product_id,
                    productSales.get(product_id) + quantity
                );
            } else {
                productSales.set(product_id, quantity);
            }
        });


    });

    const sortedProducts = Array.from(productSales.entries()).sort((a, b) => b[1] - a[1]);
    metadata.productSolds = await Promise.all(
        sortedProducts.map(async ([productId, quantity], index) => {
            const product = await Product.findOne({
                deleted: false,
                _id: productId
            }).select('_id thumbnail status title');
            if(product.title.length > 30) {
                product.title = product.title.slice(0, 30) + "..." 
            }

            return {
                rank: index + 1,
                product,
                total_quantity: quantity
            };
        })
    );

    metadata.monthlyClaim = Object.fromEntries(monthlyClaim);
    metadata.totalClaim.progress = preTotalClaim === 0 ? 0 : (metadata.totalClaim.count / preTotalClaim).toFixed(4) * 100 - 100;
    metadata.totalOrder.progress = preTotalOrder === 0 ? 0 : (metadata.totalOrder.count / preTotalOrder).toFixed(4) * 100 - 100;

    console.log(metadata);
    res.render('admin/pages/dashboard/index', {
        pageTitle: 'Trang tong quan',
        metadata,
    });
}