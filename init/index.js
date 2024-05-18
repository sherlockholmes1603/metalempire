const mongoose = require("mongoose");
const initData = require("./data.js");
const product = require("../models/product.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
const geocodingClient = mbxGeocoding({accessToken: mapToken});

const MONGO_URL = "mongodb://127.0.0.1:27017/metalempire";
const dbURL = "This is a secret which cannot be revealed";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await product.deleteMany({});
  await product.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();