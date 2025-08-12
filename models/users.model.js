const mongoose = require('mongoose');
const  bcrypt = require('bcryptjs')
const validator = require('validator')
const {Schema} = mongoose;

const userschema = new Schema({
  userName: {
    type: String,
    required: true,
    minlength: [8, "min length is 8"],
    unique: true
  },
  email: {
    type: String,
    required: [true,'Email is required'],
    unique: true,
    trim:true,
    validate:{
      validator: validator.isEmail,
      message:'Enter valid Email',
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "min length is 8"]
  },
  firstName: {
    type: String,
    required: true,
    minlength: [3, "min length is 3"],
    maxlength: [15, "max lenth is 15"]
  },
  lastName: {
    type: String,
    required: true,
    minlength: [3, "min length is 3"],
    maxlength: [15, "max lenth is 15"]
  },
  role:{
    type:String,
    default:"user",
    enm:['admin','user']
  },
  token:{
    type:String
  },
  refreshToken:{
    type:String
  }
  
});

userschema.pre('save', async function(){
  try{
     if (!this.isModified('password')) {
      return next();
    }
    let salt = await bcrypt.genSalt(13);
    let hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
  }catch(err){
    console.log(`something went wrong in hashing password`,err);
  }
})

// convert my userschema into a Model I can work with.
// then export this model to use it in routes folder
module.exports = mongoose.model("User", userschema);

// the databse by default will make collection called users (same name of model but (in plural and lowercase) )
