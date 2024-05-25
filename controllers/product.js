const products = require("../models/product.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

module.exports.index = async (req, res) => {
    const filter = req.query.filter;

    let allproducts;
    if(filter){
        allproducts = await products.find({filter: filter});
    }
    else{
        allproducts = await products.find();
    }
    res.render("products/index.ejs", {allproducts});
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
    let delproduct = await product.findByIdAndDelete(id);
    req.flash("deleted", "The product has been deleted successfully");
    // console.log(delproduct);
    res.redirect("/");
};



