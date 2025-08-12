const User = require('../models/users.model');
const Books = require('../models/books.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length > 0) return res.status(200).json({ message: "get users successfully", Users: users });
        else return res.status(200).json({ message: "there is no users to display", Users: users });
    } catch (err) {
        return res.status(404).json({ message: "there is no users to display", error: err });
    }
}

exports.addUser = async (req, res) => {
    try {
        const newuser = new User(req.body);
        const user = await newuser.save();
        res.status(201).json({ message: "user created successfully", newUser: user });
    } catch (error) {
        // return  res.status(500).json({ message: "Something went wrong", error });
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => (`${e.properties.path} ${e.message}`));
            return res.status(400).json({ message: "Validation Error", errors: messages });
        }
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.updateUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        const { userName, password, firstName, lastName, role,email} = req.body;
        if (user) {
            if (req.id == userId || req.role === "admin") {
                if(email){
                    return res.status(404).json({message:"you aren't allowed to update email"});
                }
                (userName ? user.userName = userName : "");
                (password ? user.password = password : "");
                (firstName ? user.firstName = firstName : "");
                (lastName ? user.lastName = lastName : "");
                if (req.role === "admin") {
                    (role ? user.role = role : "");
                }
                await user.save();
                return res.status(200).json({ message: "user updated successfuly", newUser: user });
            }
            else {
                return res.status(200).json({ message: "you are unauthorized" });
            }
        } else {
            return res.status(404).json({ message: "this id isn't exist", error });
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => (`${e.properties.path} ${e.message}`));
            return res.status(400).json({ message: "Validation Error", errors: messages });
        }
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "this user's Id isn't exist" });
        }

        if (req.id == userId || req.role === "admin") {
            await User.findByIdAndDelete(userId)
            await Books.deleteMany({ userId: userId });
            return res.status(200).json({ message: "user and their books deleted successfully" });
        } else {
            return res.status(403).json({ message: "you are unauthorized" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "something went wrong" });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email && !password){
            return res.status(400).json({ message: "email and password is required" })
        }
        if (!email) {
            return res.status(400).json({ message: "email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "password is required" })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "this eamil is'nt exsist" })
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ message: "password is'nt correct" })
        }
        const token = await jwt.sign({ id: user._id, email: user.email, role: user.role }, "AiRamSecretToken", { expiresIn: "3d" });
        const refresh_token = await jwt.sign({ id: user.id, email: user.email, role: user.role }, "AiRamrefreshtokensecret", { expiresIn: "3d" });
        user.refreshToken = refresh_token;
        const u = await user.save();
        res.status(200).json({ message: "token is created", token, data: u })
    } catch (err) {
        res.status(406).json({ message: "something went wrong" })
    }
}

exports.refreshToken = async (req, res) => {
    const { reToken } = req.body
    if (!reToken) {
        return res.status(400).json({ message: "the refresh Token is required" })
    }
    const payload = await promisify(jwt.verify)(reToken, "AiRamrefreshtokensecret")
    const user = User.findOne({ _id: payload.id })
    if (!user) {
        return res.status(400), json({ message: "this refresh token is'nt correct" })
    }
    const newtoken = await jwt.sign({ id: user._id, email: user.email, role: user.role }, "AiRamSecretToken", { expiresIn: "3d" })
    res.status(200).json({ message: "token is created", newtoken })
}