require("dotenv").config()
const app = require("./src/app.js")
const connectdb = require("./src/db/db.js")
const postModel=require("./src/models/post.models.js")

connectdb()

app.listen(3000,()=>{
    console.log("Server is running on port no. 3000")

   
})


