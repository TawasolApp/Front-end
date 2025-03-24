import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router("src/mocks/db.json");
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

// Example: Return users without their passwords
// server.get("/users", (req, res) => {
//   let users = _router.db.get("users").value();

//   const serializedUsers = users.map((user) => ({
//     id: user.id,
//     username: user.username,
//   }));

//   res.jsonp(serializedUsers);
// });

server.get("/connections/list", (req, res) => {
  try {
    let connections = _router.db.get("connections").value();
    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve list of connections" });
  }
});


server.get('/connections/pending', (req, res) => {
  try {
    const pendingConnections = _router.db.get('pendingConnections').value();
    res.status(200).jsonp(pendingConnections);
  } catch (error) {
    res.status(500).jsonp({ error: "Failed to retrieve pending connections" });
  }
});

server.patch("/connections/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const { isAccept } = req.body; // Extract isAccept flag
    const db = _router.db;

    // Find user in pendingConnections
    const pendingConnections = db.get("pendingConnections").value();
    const user = pendingConnections.find((u) => u.userId === userId);

    if (!user) {
      return res.status(404).json({ message: "User ID does not exist" });
    }

    // If accepted, move to connections
    if (isAccept) {
      db.get("connections").push(user).write();
    }

    // Remove from pendingConnections regardless
    db.get("pendingConnections").remove({ userId }).write();

    res.status(200).json({ 
      message: isAccept ? "Connection request accepted" : "Connection request ignored", 
      user 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update connection request status" });
  }
});


server.delete("/connections/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const db = _router.db;

    // Check if the user exists in connections
    const connections = db.get("connections").value();
    const user = connections.find((u) => u.userId === userId);

    if (!user) {
      return res.status(404).json({ message: "User ID does not exist" });
    }

    // Remove user from connections
    db.get("connections").remove({ userId }).write();

    res.status(204).send(); // No Content (success)
  } catch (error) {
    res.status(500).json({ message: "Failed to remove connection" });
  }
});



server.get("/connections/following", (req, res) => {
  try {
    const following = _router.db.get("following").value();
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve list of followings" });
  }
});


server.get("/connections/followers", (req, res) => {
  try {
    const followers = _router.db.get("followers").value();
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve list of followers" });
  }
});

server.post("/connections/follow", (req, res) => {
  try {
    const { userId } = req.body;
    const db = _router.db;

    console.log("Looking for follower with userId:", userId); // Debug log
    
    // 1. Find user in followers list
    const followers = db.get("followers").value();
    const follower = followers.find(f => f.userId == userId); // Note: using == for type coercion
    
    if (!follower) {
      console.log("Follower not found in:", followers); // Debug log
      return res.status(404).json({ message: "User not found in followers" });
    }

    // 2. Add to following list
    db.get("following").push(follower).write();
    
    console.log("Added to following:", follower); // Debug log
    return res.status(201).json(follower);

  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ message: "Failed to follow user" });
  }
});


server.delete("/connections/unfollow/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const db = _router.db;

    // Check if the user exists in following
    const followingList = db.get("following").value();
    const user = followingList.find((u) => u.userId === userId);

    if (!user) {
      return res.status(404).json({ message: "User ID does not exist" });
    }

    // Remove user from following
    db.get("following").remove({ userId }).write();

    res.status(204).send(); // No Content (success)
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow user" });
  }
});


server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});