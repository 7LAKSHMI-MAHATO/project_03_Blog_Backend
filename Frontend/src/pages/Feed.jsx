import React, { useState, useEffect } from "react"
import axios from "axios"

const Feed = () => {

    const [posts, setPosts] = useState([])

    const [editingId, setEditingId] = useState(null)
    const [editedCaption, setEditedCaption] = useState("")


    // ================= GET POSTS =================

    useEffect(() => {

        axios.get("http://localhost:3000/posts")
            .then((res) => {

                setPosts(res.data.posts)

            })
            .catch((err) => {

                console.error(err)

            })

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
                                        ? "Unlike"
                                        : "Like"
                                }

                                {" "}

                                {post.likes}

                            </button>


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