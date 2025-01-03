import {Schema} from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema({
        name: {type: String,required: true},
        userName: {type: String,required: true,unique: true},
        password: {type: String,required: true},
        token: {type: String}
})

const User = mongoose.model("User",userSchema);

export {User};
