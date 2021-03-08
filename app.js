import { dbURL, port } from "./config"
import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import busboy from "connect-busboy"
import cors from "cors"

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(busboy())
app.use(cors());

const passport = require('passport');
require('./config/passport_config');
app.use(passport.initialize());
app.use(passport.session());

const routes = require('./routes/index');
routes(app);

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    autoReconnect:true,
    reconnectTries:Number.MAX_VALUE,
    reconnectInterval:500
}).then(() => {
    console.log("Successfully connected to the database");
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}).catch((err) => {
    console.log(err)
    console.log('Could not connect to the database. Will attempt to reconnect later...');
});