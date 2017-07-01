module.exports.cartModel = function (cart) {
    if (cart == "" || cart == undefined || cart == null) {
        //Create an Object if doesnt exists
        var obj = {
            items: {},
            totalQuantity: 0,
            subTotal: 0
        };
    }
    else {
        //If Exists send the Current Cart as response
        var obj = {
            items: cart.items,
            totalQuantity: cart.totalQuantity,
            subTotal: cart.subTotal
        };
    }

    return obj;
}

//Add Product
module.exports.addOrUpdateCart = function (cart, product) {
    console.log("Product ", product);
    console.log("Cart ", cart);
    if (cart.items[product._id]) {
        console.log("Inside Update");
        //Update existing Cart
        cart.items[product._id].quantity++;
        cart.items[product._id].price = product.price * cart.items[product._id].quantity;
        cart.totalQuantity = cart.totalQuantity + 1;
        cart.subTotal = cart.subTotal + product.price;
    } else {
        //Add New Product
        console.log("Inside Create");
        cart.items[product._id] = {
            item: product,
            quantity: 1,
            price: product.price
        }
        cart.totalQuantity = cart.totalQuantity + 1;
        cart.subTotal = cart.subTotal + product.price;
    }
    return cart;
}
//Remove Item from cart
module.exports.removeItemFromCart=function(cart,productId){
            if(cart.items[productId]){
                console.log("Inside delete block");
                cart.totalQuantity=cart.totalQuantity-cart.items[productId].quantity;
                cart.subTotal=cart.subTotal-cart.items[productId].price;
                delete cart.items[productId];
            }
    return cart;           
}