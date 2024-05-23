const User = require("../models/user");
const Product = require("../models/product.js")

module.exports.signup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email: email, username: username, isAdmin: false});
        const registerdUser = await User.register(newUser, password);   
        console.log(registerdUser);
        req.login(registerdUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome ${username} to Wanderlust`);
            res.redirect("/products");
        });
        
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderSignup = (req, res) => {
    res.render("user/signup.ejs")
};

module.exports.login = async (req, res) => {
    req.flash("success", "Login successful! Welcome back to wanderlust");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/products");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("user/login.ejs");
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/products");
    })

};

module.exports.cartItems = async (req, res, next) => {
    let curUser = await User.findById(res.locals.user._id).populate("cart.products");
    if (!curUser.cart) {
        curUser.cart = { quantity: 0, products: [] };
        await curUser.save();
    }
    const cartItems = curUser.cart.products;
    const cartQuantity = curUser.cart.quantity;

    res.render("user/cart.ejs", {cartItems, cartQuantity});
};

module.exports.addItemsToCart = async (req, res, next) => {
    let { id } = req.params;
    let curUser = await User.findById(res.locals.user._id).populate('cart.products');

    if (!curUser.cart) {
        curUser.cart = { quantity: 0, products: [] };
    }

    let productInCart = curUser.cart.products.find(product => product._id.equals(id));

    if (productInCart) {
        req.flash("success", "Product is already in the cart");
        res.redirect(`/products/${id}`);
    } else {
        let productToAdd = await Product.findById(id);
        curUser.cart.products.push(productToAdd);
        curUser.cart.quantity += 1;  
        await curUser.save();
        req.flash("success", "Product added to cart");
        res.redirect('/cart');
    } 
};

module.exports.removeItemsFromCart = async (req, res, next) => {
    let { id } = req.params;
    let curUser = await User.findById(res.locals.user._id);
    curUser.cart.products = curUser.cart.products.filter(product => !product._id.equals(id));
    curUser.cart.quantity = curUser.cart.products.length;
    await curUser.save();
    req.flash('success', 'Item removed from cart');
    res.redirect('/cart');
};