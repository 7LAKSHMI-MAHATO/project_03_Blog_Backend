import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'
import Signup from './Signup'
import Login from './Login'

const App = () => {

  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <Router>

      <div>

        {/* NAVBAR */}

        <nav>

          {user ? (
            <>
              <span>Welcome, {user.username} 👋</span>

              <Link to="/">Feed</Link>
              {" | "}

              <Link to="/create-post">Create Post</Link>
              {" | "}

              <button
                onClick={() => {
                  localStorage.removeItem("user")
                  window.location.href = "/login"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              {" | "}
              <Link to="/signup">Signup</Link>
            </>
          )}

        </nav>

        <Routes>

          <Route
            path="/create-post"
            element={<CreatePost />}
          />

          <Route
            path="/"
            element={<Feed />}
          />

          <Route
            path="/feed"
            element={<Feed />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

        </Routes>

      </div>

    </Router>
  )
}

export default App