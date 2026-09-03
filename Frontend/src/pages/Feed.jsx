import React, { useState, useEffect } from "react"
import axios from "axios"

const Feed = () => {

    const [posts, setPosts] = useState([])

    const [editingId, setEditingId] = useState(null)
    const [editedCaption, setEditedCaption] = useState("")



    const [commentText, setCommentText] = useState({})
    const [comments, setComments] = useState({})


    // ================= GET POSTS =================

   useEffect(() => {

    const fetchPostsAndComments = async () => {

        try {

            const postResponse = await axios.get(
                "http://localhost:3000/posts"
            )

            const postsData = postResponse.data.posts

            setPosts(postsData)


            const commentsData = {}

            for (const post of postsData) {

                const commentResponse = await axios.get(
                    `http://localhost:3000/comments/${post._id}`
                )

                commentsData[post._id] =
                    commentResponse.data
            }

            setComments(commentsData)

        } catch (err) {

            console.error(err)

        }
    }

    fetchPostsAndComments()

}, [])

    // ================= DELETE =================

    const handleDelete = async (id) => {

        try {

            await axios.delete(
                `http://localhost:3000/posts/${id}`
            )

            setPosts((prevPosts) =>
                prevPosts.filter(
                    (post) => post._id !== id
                )
            )

        } catch (err) {

            console.error(err)

            alert("Error deleting post")

        }
    }


    // ================= EDIT =================

    const handleEdit = async (id) => {

        try {

            const res = await axios.put(
                `http://localhost:3000/posts/${id}`,
                {
                    caption: editedCaption
                }
            )

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id
                        ? {
                            ...post,
                            caption: res.data.post.caption
                        }
                        : post
                )
            )

            setEditingId(null)
            setEditedCaption("")

        } catch (err) {

            console.error(err)

            alert("Error updating post")

        }
    }


    // ================= LIKE / UNLIKE =================

    const handleLike = async (id) => {

        try {

            const res = await axios.put(
                `http://localhost:3000/posts/${id}/like`
            )

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id
                        ? res.data.post
                        : post
                )
            )

        } catch (err) {

            console.error(err)

            alert("Error liking post")

        }
    }



    // ================= ADD COMMENT =================

const handleComment = async (postId) => {

    try {

        const text = commentText[postId]
        const user = JSON.parse(localStorage.getItem("user"))

        if (!text || text.trim() === "") {
            return
        }

        const res = await axios.post(
            "http://localhost:3000/comments",
            {
                postId: postId,
                text: text,
                   username: user.username
            }
        )

        setComments((prevComments) => ({
            ...prevComments,
            [postId]: [
                ...(prevComments[postId] || []),
                res.data.comment
            ]
        }))

        setCommentText((prevText) => ({
            ...prevText,
            [postId]: ""
        }))

    } catch (err) {

        console.error(err)

        alert("Error adding comment")

    }
}


// ================= DELETE COMMENT =================

const handleDeleteComment = async (commentId, postId) => {

    try {

        await axios.delete(
            `http://localhost:3000/comments/${commentId}`
        )

        setComments((prevComments) => ({
            ...prevComments,
            [postId]: prevComments[postId].filter(
                (comment) => comment._id !== commentId
            )
        }))

    } catch (err) {

        console.error(err)

        alert("Error deleting comment")

    }
}







    // ================= UI =================

    return (

        <section className="feed-section">

            {
                posts.length > 0 ? (

                    posts.map((post) => (

                        <div
                            key={post._id}
                            className="post-card"
                        >

                            {/* IMAGE */}

                            <img
                                src={post.image}
                                alt={post.caption}
                            />


                            {/* CAPTION */}

                            {
                                editingId === post._id ? (

                                    <div>

                                        <input
                                            type="text"
                                            value={editedCaption}
                                            onChange={(e) =>
                                                setEditedCaption(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    post._id
                                                )
                                            }
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => {

                                                setEditingId(null)
                                                setEditedCaption("")

                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                ) : (

                                    <p>
                                        {post.caption}
                                    </p>

                                )
                            }


                            {/* LIKE / UNLIKE */}

                            <button
                                onClick={() =>
                                    handleLike(post._id)
                                }
                            >

                                {
                                    post.liked
                                        ? "❤️"
                                        : "🤍"
                                }

                                {" "}

                                {post.likes}

                            </button>



                            {/* COMMENTS */}

<div>

    <input
        type="text"
        placeholder="Write a comment..."
        value={commentText[post._id] || ""}
        onChange={(e) =>
            setCommentText((prevText) => ({
                ...prevText,
                [post._id]: e.target.value
            }))
        }
    />

    <button
        onClick={() =>
            handleComment(post._id)
        }
    >
        Comment
    </button>

</div>




{/* DISPLAY COMMENTS */}

<div>

    {
        comments[post._id]?.map((comment) => (

            <div key={comment._id}>

                <p>
                  
    💬 <strong>{comment.username}</strong>: {comment.text}
</p>
                

                <button
                    onClick={() =>
                        handleDeleteComment(
                            comment._id,
                            post._id
                        )
                    }
                >
                    Delete
                </button>

            </div>

        ))
    }

</div>

                            {/* EDIT */}

                            <button
                                onClick={() => {

                                    setEditingId(post._id)

                                    setEditedCaption(
                                        post.caption
                                    )

                                }}
                            >
                                Edit
                            </button>


                            {/* DELETE */}

                            <button
                                onClick={() =>
                                    handleDelete(
                                        post._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))

                ) : (

                    <p>
                        No posts available.
                    </p>

                )
            }

        </section>
    )
}

export default Feed