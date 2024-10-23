const connectToMongo = require('./db');
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

connectToMongo();

app.use(express.json());
app.use(cors())

// Available routes
app.use("/api/auth",require("./routes/auth.js"));
app.use("/api/notes",require("./routes/notes.js"));


app.listen(port,()=>{
    console.log(`App listening to port ${port}`)
})
