const jwt = require("jsonwebtoken")
const {promisify} = require("util")


// use of this function : check that user loin , gives role of this user for next (restrictTO)
exports.authUserLogin =  async(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(400).json({message:"login first"})
    }
    try{
    const payloads = await promisify(jwt.verify)(authorization,"AiRamSecretToken") // payloads are role, email,id 
        req.role = payloads.role // this request for( restrict to) as it is in the layer after that 
        req.id = payloads.id;
        // role important to restict crud operations  
        next()
    }catch(error){
        res.status(401).json({message:"unauthorized",err:error})
    }
}

// use of this function : check that user has access for this process(get,patch..), go to next if he has access 
exports.restrictTO = (...role)=> {

    return function(req,res,next){
        // if the role that is sent from token isn't included with roles who can modify on data so he is unauthorized 
        if(!role.includes(req.role)){   
            return res.status(401).json({message:"you are unauthorized"})
        }  
        // if he can modify (authorized )
        next();
    }
}