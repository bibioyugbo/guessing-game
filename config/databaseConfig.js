const mongoDB = require('mongoose')
const env = require('dotenv')
env.config()

const connectDB = async ()=>{
    try{
        await mongoDB.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");
    }catch(err){
        console.log(err.message);
    }

}

module.exports = {
    connectDB
};
