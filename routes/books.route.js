const express = require('express');
const router = express.Router();

const {authUserLogin,restrictTO} = require("../middlewares/auth.middleware")
const {getallBooks,getBooksByUserId,addNewBook,updateBookById,deleteBookById} = require("../controllers/books.controller");

router.get('/',authUserLogin,restrictTO('admin','user'),getallBooks);
//In case of user => only books he posted is appeared 
//In case of admin => all books is appeared 

router.get('/:id',authUserLogin,restrictTO('admin'),getBooksByUserId);
router.post('/',authUserLogin,restrictTO('user','admin'),addNewBook);
router.patch('/:id',authUserLogin,restrictTO('user','admin'),updateBookById);
router.delete('/:id',authUserLogin,restrictTO('user','admin'),deleteBookById);

module.exports= router;

