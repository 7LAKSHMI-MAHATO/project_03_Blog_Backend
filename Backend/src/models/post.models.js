const mongoose=require("mongoose")

const postSchema= new mongoose.Schema({
    image: String,
    imageId: String,
    caption: String,

    username: {
    type: String,
    required: true
},

    likes :{
        type: Number,
        default: 0
    },
    liked: {
        type: Boolean,
        default: false
    }
    
})



const postModel = mongoose.model("post",postSchema)



module.exports = postModel



