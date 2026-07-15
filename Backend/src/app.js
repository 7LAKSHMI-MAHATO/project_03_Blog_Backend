// (it contains )

const express = require("express")
const multer = require("multer")
const uploadfile = require('./services/storage.service')
const postModel = require("./models/post.models")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
const upload = multer({ storage:multer.memoryStorage() })

app.post("/create-post", upload.single("image"), async (req,res)=>{

    // console.log(req.body)
    // console.log(req.file)

    try{
        if (!req.file){
            return res.status(400).json({error: "image file is required"
        })
    }
     
    const result = await uploadfile(req.file.buffer)
     console.log("hii i reached here")
    // console.log(result)
    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption
    })
    
   return res.status(201).json({
    message:"post created successflly in db",
    post})

}
catch(err){
    console.error(err)
    return res.status(500).json({error: err.message||"server error"})
}
})


app.get("/posts", async(req,res) => {


    const posts = await postModel.find()

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })
})












module.exports=app

// console.log("buildging a blog appp from scratch")





























































// app.listen(3000, ()=>{
    // console.log("I an gennius")
// })