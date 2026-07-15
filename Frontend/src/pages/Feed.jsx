import React, { useState , useEffect} from 'react'
import axios from 'axios'

const Feed = () => {

    const [posts, setPosts] = useState([
        {
            _id:"1",
            image:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
            caption:"This is a beautiful image of nature."
        }
    ])
useEffect(() =>{

    axios.get('http://localhost:3000/posts')
    .then((res) =>{
        setPosts(res.data.posts)
    })
} , [])

  return (
    <section className='feed-section'>
       {
        posts.length > 0 ? (
            posts.map((post) => (
                <div key={post._id} className='post-card'>
                    <img src={post.image} alt={post.caption} />
                    <p>{post.caption}</p>
                </div>
            ))
        ) : (
            <p>No posts available.</p>
        )}
    </section>
  )
}

export default Feed
