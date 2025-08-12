const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const booksRoute = require("./routes/books.route");
const usersRoute = require("./routes/users.route");
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require("./swagger_books_users.json") 


// connection to mongo
mongoose.connect('mongodb://127.0.0.1:27017/Books_logger').then(()=>{
    console.log("Connected to mongoDb successfully :) ");
}).catch((err)=>{
    console.log('Error in connection to mongoDB',err);
})

// routes
app.use(express.json()); 
app.use('/users',usersRoute);
app.use('/books',booksRoute);

// swagger
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDoc))


//listen to port 
app.listen(port,()=>{
    console.log(`app is listening to port ${port}`);
})


