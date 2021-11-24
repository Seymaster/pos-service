require("dotenv").config();
const express = require("express");
const app     = express();
const PORT    = process.env.PORT || 8080;
const logger  = require("morgan");
const cors    = require("cors");
const mongoose = require("mongoose")
const config   = require("./config/mongo");

mongoose.Promise = global.Promise;


app.listen(PORT, (err)=> {
    console.log(err)
})


app.use(logger("dev"));
app.use(express.json());
app.use(cors({origin: "*"}));
// app.use("/events", webookRouter)


mongoose.connect(config.dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=> {
    console.log("database connected");
})
.catch(err => {
    console.log(err);
})

app.use((req, res, next)=> {
    return res.status(404).send({
        status: 404,
        message: "This API endpoint doesnt exist"
    })
});