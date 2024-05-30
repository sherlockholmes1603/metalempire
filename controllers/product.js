const products = require("../models/product.js");

module.exports.index = async (req, res) => {
    let allProducts = await products.find();

    const { minPrice, maxPrice, productType } = req.query;

    let result = allProducts;

    if (productType && productType.length > 0) {
        result = result.filter(product => productType.includes(product.filter));
    }

    if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) : Number.MIN_SAFE_INTEGER;
        const max = maxPrice ? parseInt(maxPrice) : Number.MAX_SAFE_INTEGER;

        result = result.filter(product => product.price >= min && product.price <= max);
    }
    res.render('./products/index.ejs', { allproducts: result });
};



module.exports.renderNewForm = (req, res) => {
    res.render("products/new.ejs");
};

module.exports.showproduct = async (req, res) => {
    let {id} = req.params;
    const product = await products.findById(id).populate({path: "reviews", populate:{path: "author"}});
    if(!product){
      req.flash("error", "product you requested does not exits");
      res.redirect("/products")
    }
    res.render("products/show.ejs", {product})
};


module.exports.createproduct = async (req, res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(filename, ":  ", url)
    const newproduct = new products(req.body.product);
    newproduct.owner = req.user._id;
    newproduct.image = {url, filename};
    await newproduct.save();
    req.flash("success", "New product Created");
    res.redirect("/products");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let product = await products.findById(id);
    if(!product){
      req.flash("error", "product you requested does not exits");
      return res.redirect("/products")
    }
    res.render("products/edit.ejs", {product});
};


module.exports.editproduct = async (req, res) => {
    let {id} = req.params;
    let product = await products.findByIdAndUpdate(id, {...req.body.product});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(filename, ":  ", url)
        product.image.url = url;
        product.image.filename = filename;
        await product.save();
    }
    res.redirect(`/products/${id}`);
};

module.exports.destroyproduct = async (req, res) => {
    let {id} = req.params;
    let delproduct = await products.findByIdAndDelete(id);
    req.flash("deleted", "The product has been deleted successfully");
    // console.log(delproduct);
    res.redirect("/");
};



