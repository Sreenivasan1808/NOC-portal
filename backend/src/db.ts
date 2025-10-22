import mongoose from "mongoose";
import config from "./config/config.js";

mongoose.connect(config.mongo_url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

export default db;