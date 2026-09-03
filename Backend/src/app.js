// (it contains )

const express = require("express")
const multer = require("multer")
const uploadfile = require('./services/storage.service')
const postModel = require("./models/post.models")
const cors = require("cors")
const commentModel = require("./models/comment.models")
const userModel = require("./models/user.models")



const app = express()
app.use(cors())
app.use(express.json())

// ================= SIGNUP =================

app.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body

        // Check all fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // Check if username already exists
        const existingUsername = await userModel.findOne({
            username: username
        })

        if (existingUsername) {
            return res.status(400).json({
                message: "Username already exists"
            })
        }

        // Check if email already exists
        const existingEmail = await userModel.findOne({
            email: email
        })

        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        // Create user
        const user = await userModel.create({
            username,
            email,
            password
        })

        return res.status(201).json({
            message: "User registered successfully",
            user
        })

    } catch (error) {

        console.error(error)

        return res.status(500).json({
            message: "Signup failed"
        })
    }
})


// ================= LOGIN =================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await userModel.findOne({
            email: email
        })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        return res.status(200).json({
            message: "Login successful",
            user
        })

    } catch (error) {

        console.error(error)

        return res.status(500).json({
            message: "Login failed"
        })
    }
})


const upload = multer({ storage:multer.memoryStorage() })
// create post route
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

// ================= ADD COMMENT =================

app.post("/comments", async (req, res) => {

    try {

        const { postId, text } = req.body

        console.log("POST ID RECEIVED:", postId)
        console.log("TEXT RECEIVED:", text)

        if (!postId || !text) {
            return res.status(400).json({
                message: "Post ID and comment are required"
            })
        }

        // Get logged-in user from localStorage sent by frontend
        const username = req.body.username

        if (!username) {
            return res.status(400).json({
                message: "Username is required"
            })
        }

        const comment = await commentModel.create({
            postId,
            username,
            text
        })

        console.log("COMMENT SAVED:", comment)

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        })

    } catch (error) {

        console.error(error)

        return res.status(500).json({
            message: "Failed to add comment"
        })
    }
})
     
   


// Get comments for a post
app.get("/comments/:postId", async (req, res) => {
    try {
        const { postId } = req.params
         console.log("GET COMMENTS FOR POST:", postId)

        const comments = await commentModel.find({ postId })

        console.log("COMMENTS FOUND:", comments)
        
        
        res.status(200).json(comments)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Failed to get comments"
        })
    }
})


// ================= DELETE COMMENT =================

app.delete("/comments/:commentId", async (req, res) => {
    try {
        const { commentId } = req.params

        const comment = await commentModel.findByIdAndDelete(commentId)

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            })
        }

        return res.status(200).json({
            message: "Comment deleted successfully",
            comment
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: "Failed to delete comment"
        })
    }
})







// read posts
app.get("/posts", async(req,res) => {


    const posts = await postModel.find()

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })
})

// dealete post
app.delete("/posts/:id", async (req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.id)

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            })
        }

        return res.status(200).json({
            message: "Post deleted successfully",
            post
        })
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: err.message || "Server error"
        })
    }
})




// UPDATE POST CAPTION
app.put("/posts/:id", async (req, res) => {
    try {
        const post = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                caption: req.body.caption
            },
            {
                new: true
            }
        )

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            })
        }

        return res.status(200).json({
            message: "Post updated successfully",
            post
        })

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: err.message || "Server error"
        })
    }
})




// ================= LIKE / UNLIKE POST =================

app.put("/posts/:id/like", async (req, res) => {

    try {

        const post = await postModel.findById(req.params.id)

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            })
        }

        // If already liked → Unlike
        if (post.liked === true) {

            post.liked = false
            post.likes = Math.max(0, post.likes - 1)

        }

        // If not liked → Like
        else {

            post.liked = true
            post.likes = post.likes + 1

        }

        await post.save()

        return res.status(200).json({
            message: post.liked
                ? "Post liked successfully"
                : "Post unliked successfully",
            post
        })

    } catch (err) {

        console.error(err)

        return res.status(500).json({
            error: err.message || "Server error"
        })
    }
})
 



module.exports=app

// console.log("buildging a blog appp from scratch")





























































// app.listen(3000, ()=>{
    // console.log("I an gennius")
// })