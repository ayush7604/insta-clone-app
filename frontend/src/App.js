import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setToken(data.token);
  };

  const loadFeed = async () => {
    const res = await fetch("http://localhost:5000/api/feed", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setPosts(data);
  };

  const createPost = async () => {
    await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ imageUrl, caption })
    });
    loadFeed();
  };

  useEffect(() => {
    if (token) loadFeed();
  }, [token]);

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <input placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="password" type="password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Create Post</h2>
      <input placeholder="Image URL" onChange={e => setImageUrl(e.target.value)} />
      <input placeholder="Caption" onChange={e => setCaption(e.target.value)} />
      <button onClick={createPost}>Post</button>

      <h2>Feed</h2>
      {posts.map(p => (
        <div key={p._id}>
          <img src={p.imageUrl} width="200" />
          <p>{p.caption}</p>
          <p>by {p.userId.username}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
