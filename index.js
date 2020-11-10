const express = require('express');
const app = express();

app.get('/', (req, res)=> {
    res.send("We are live")
});

app.listen(3333, ()=>console.log("Server is live at port 3333"));