const express = require ('express');
const router = express.Router();
const booksRoute = require("./books.route");
const {authUserLogin,restrictTO} = require("../middlewares/auth.middleware")

const {getUsers,addUser,updateUserById,deleteUserById,login,refreshToken} = require("../controllers/user.controller"); 

router.post('/register',addUser);
router.post('/login',login);

router.get('/',authUserLogin,restrictTO('admin'),getUsers);
router.patch('/:id',authUserLogin,restrictTO('user','admin'),updateUserById);
router.delete('/:id',authUserLogin,restrictTO('user','admin'),deleteUserById); 

router.post('/refreshtoken',refreshToken);

module.exports = router;