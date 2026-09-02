const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            required: true
        },

        text: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const commentModel = mongoose.model("comment", commentSchema)

module.exports = commentModel