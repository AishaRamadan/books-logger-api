const mongoose = require('mongoose');
const {Schema} = mongoose;


const Bookschema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50,
    },
    author:{
        type:String,
        required:true,
        maxlength:30
    },
    rate:{
        type:Number,
        required:true
    },
    notes:{
        type:String,
        required:true
    }

},{timestamps: true})


module.exports = mongoose.model("Books", Bookschema);