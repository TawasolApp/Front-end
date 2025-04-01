import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router("./src/mocks/db.json");
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

server.get("/connections/list", (req, res) => {
  try {
    let connections = _router.db.get("connections").value();
    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve list of connections" });
  }
});

server.get("/connections/pending", (req, res) => {
  try {
    const pendingConnections = _router.db.get("pendingConnections").value();
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
      message: isAccept
        ? "Connection request accepted"
        : "Connection request ignored",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update connection request status" });
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
    const follower = followers.find((f) => f.userId == userId); // Note: using == for type coercion

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

server.post("/auth/check-email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const users = _router.db.get("auth").value();
  const userExists = users.some((u) => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: "Email is already in use" });
  }

  return res.status(200).json({ message: "Email is available" });
});

server.post("/auth/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).send();
  }

  const users = _router.db.get("auth").value();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).send();
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    firstName: firstName || "",
    lastName: lastName || "",
  };

  _router.db.get("auth").push(newUser).write();

  return res.status(201).send();
});

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const users = _router.db.get("auth").value();
  const user = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!user) {
    return res.status(401).send();
  }

  return res.status(200).json({
    token: "mock_access_token",
    refreshToken: "mock_refresh_token",
  });
});

server.patch("/user/update-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const users = _router.db.get("auth").value();

  const userId = "1"; // Mock user ID with 1 for simplicity
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== currentPassword) {
    return res.status(400).json({ message: "Incorrect current password" });
  }

  user.password = newPassword;
  _router.db
    .get("auth")
    .find({ id: userId })
    .assign({ password: newPassword })
    .write();

  return res.status(200).json({ message: "Password changed successfully" });
});

server.post("/auth/forgot-password", (req, res) => {
  return res.status(200).json({
    message: "If this email exists, a password reset link has been sent",
  });
});

// Add these endpoints to your existing server.js
server.get("/users/confirm-email-change", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // Mock token verification - in real app this would check your database
  const users = _router.db.get("auth").value();
  const pendingChanges = _router.db.get("pendingEmailChanges").value() || [];

  const changeRequest = pendingChanges.find((req) => req.token === token);

  if (!changeRequest) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Update user's email
  const user = users.find((u) => u.id === changeRequest.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.email = changeRequest.newEmail;
  _router.db
    .get("auth")
    .find({ id: changeRequest.userId })
    .assign(user)
    .write();

  // Remove the pending change
  _router.db
    .set(
      "pendingEmailChanges",
      pendingChanges.filter((req) => req.token !== token),
    )
    .write();

  return res.status(200).json({ message: "Email updated successfully" });
});

server.patch("/users/request-email-update", (req, res) => {
  const { newEmail, password } = req.body;
  const users = _router.db.get("auth").value();

  const userId = "1"; // For simplicity
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  if (users.some((u) => u.email === newEmail)) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const token = `mock_token_${Math.random().toString(36).substring(2, 9)}`;
  const pendingChanges = _router.db.get("pendingEmailChanges").value() || [];

  _router.db
    .set("pendingEmailChanges", [
      ...pendingChanges,
      {
        userId,
        newEmail,
        token,
        createdAt: new Date().toISOString(),
      },
    ])
    .write();

  const verificationLink = `http://localhost:5173/auth/email-token-verification?token=${token}`;
  console.log(`Mock verification email sent with link: ${verificationLink}`);

  return res.status(200).json({
    message: "Verification email sent",
    mockVerificationLink: verificationLink, // For testing
  });
});

const supportedTypes = ["education", "experience", "skills", "certifications"];
// GET all users
server.get("/profile", (req, res) => {
  const users = _router.db.get("users").value();
  res.status(200).json(users);
});

//////////Main User Apis\\\\\\\\\\
// GET user profile by ID
server.get("/profile/:id", (req, res) => {
  const userId = req.params.id; // keep as string
  const users = _router.db.get("users").value();
  const user = users.find((u) => String(u.id) === String(userId));

  if (user) {
    res.jsonp(user);
  } else {
    res.status(404).jsonp({ error: "User not found" });
  }
});

// PATCH main profile data
server.patch("/profile", (req, res) => {
  const users = _router.db.get("users").value();
  const { id, ...updates } = req.body;

  const userIndex = users.findIndex((u) => String(u.id) === String(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const updatedUser = { ...users[userIndex], ...updates };
  _router.db
    .get("users")
    .find({ id: String(id) })
    .assign(updatedUser)
    .write();

  res.status(200).json(updatedUser);
});

//////////education , skills, experinces ,, certifications Apis\\\\\\\\\\

server.post("/profile/:id/education", (req, res) => {
  const userId = req.params.id;
  const newItem = { id: Date.now().toString(), ...req.body };
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const items = user.get("education").value() || [];
  user.assign({ education: [...items, newItem] }).write();
  return res.status(201).json(newItem);
});

server.post("/profile/:id/experience", (req, res) => {
  const userId = req.params.id;
  const newItem = { id: Date.now().toString(), ...req.body };
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const items = user.get("experience").value() || [];
  user.assign({ experience: [...items, newItem] }).write();
  return res.status(201).json(newItem);
});

server.post("/profile/:id/certifications", (req, res) => {
  const userId = req.params.id;
  const newItem = { id: Date.now().toString(), ...req.body };
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const items = user.get("certifications").value() || [];
  user.assign({ certifications: [...items, newItem] }).write();
  return res.status(201).json(newItem);
});
server.post("/profile/:id/skills", (req, res) => {
  const userId = req.params.id;
  const newItem = { id: Date.now().toString(), ...req.body };

  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });

  const items = user.get("skills").value() || [];
  user.assign({ skills: [...items, newItem] }).write();

  return res.status(201).json(newItem);
});

server.patch("/profile/:userId/education/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const updatedItems = user
    .get("education")
    .map((item) =>
      String(item.id) === itemId ? { ...item, ...req.body } : item,
    )
    .value();
  user.assign({ education: updatedItems }).write();
  const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
  res.status(200).json(updatedItem);
});

server.patch("/profile/:userId/experience/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const updatedItems = user
    .get("experience")
    .map((item) =>
      String(item.id) === itemId ? { ...item, ...req.body } : item,
    )
    .value();
  user.assign({ experience: updatedItems }).write();
  const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
  res.status(200).json(updatedItem);
});

server.patch("/profile/:userId/certifications/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const updatedItems = user
    .get("certifications")
    .map((item) =>
      String(item.id) === itemId ? { ...item, ...req.body } : item,
    )
    .value();
  user.assign({ certifications: updatedItems }).write();
  const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
  res.status(200).json(updatedItem);
});

server.patch("/profile/:userId/skills/:itemId", (req, res) => {
  const { userId, itemId } = req.params;

  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });

  const updatedItems = user
    .get("skills")
    .map((item) =>
      String(item.id) === itemId ? { ...item, ...req.body } : item,
    )
    .value();

  user.assign({ skills: updatedItems }).write();

  const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
  res.status(200).json(updatedItem);
});

server.delete("/profile/:userId/education/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const filteredItems = user
    .get("education")
    .filter((item) => String(item.id) !== itemId)
    .value();
  user.assign({ education: filteredItems }).write();
  res.status(204).end();
});

server.delete("/profile/:userId/experience/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const filteredItems = user
    .get("experience")
    .filter((item) => String(item.id) !== itemId)
    .value();
  user.assign({ experience: filteredItems }).write();
  res.status(204).end();
});

server.delete("/profile/:userId/certifications/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const filteredItems = user
    .get("certifications")
    .filter((item) => String(item.id) !== itemId)
    .value();
  user.assign({ certifications: filteredItems }).write();
  res.status(204).end();
});
server.delete("/profile/:userId/skills/:itemId", (req, res) => {
  const { userId, itemId } = req.params;

  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });

  const filteredItems = user
    .get("skills")
    .filter((item) => String(item.id) !== itemId)
    .value();

  user.assign({ skills: filteredItems }).write();
  res.status(204).end();
});

const currentUser = {
  id: "mohsobh",
  name: "Mohamed Sobh",
  picture:
    "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4",
  bio: "Computer Engineering Student at Cairo University",
  type: "User",
};

/*********************************************************** POSTS ***********************************************************/
server.get("/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const allPosts = _router.db.get("posts").orderBy("timestamp", "desc").value();
  const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);
  console.log(paginatedPosts);
  res.jsonp(paginatedPosts);
});

server.post("/posts", (req, res) => {
  const { authorId, content, media, taggedUsers, visibility } = req.body;

  // Basic validation
  if (!authorId || !content) {
    return res.status(400).json({ error: "authorId and content are required" });
  }

  const newPost = {
    id: Date.now().toString(),
    isSaved: false,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorPicture: currentUser.picture,
    authorBio: currentUser.bio,
    content: content,
    media: media,
    reactions: {
      Love: 0,
      Celebrate: 0,
      Insightful: 0,
      Funny: 0,
      Support: 0,
      Like: 0,
    },
    comments: 0,
    shares: 0,
    taggedUsers: taggedUsers,
    visibility: visibility,
    authorType: currentUser.type,
    reactType: null,
    timestamp: new Date().toISOString(),
  };

  // Access the existing posts
  const posts = _router.db.get("posts");

  // Add the new post and persist the change
  posts.push(newPost).write();

  res.status(201).json(newPost);
});

server.delete("/delete/:postId", (req, res) => {
  const { postId } = req.params;
  const posts = _router.db.get("posts");
  // Find the post
  const postToDelete = posts.find({ id: postId }).value();
  if (!postToDelete) {
    return res.status(404).json({ error: "Post not found" });
  }
  // Remove the post and persist the change
  posts.remove({ id: postId }).write();
  res.status(200).json({ message: "Post deleted successfully" });
});

server.patch("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { authorId, content, media, taggedUsers, visibility } = req.body;
  const posts = _router.db.get("posts");
  const post = posts.find({ id: postId }).value();
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  // Update post details
  posts
    .find({ id: postId })
    .assign({
      content: content || post.content,
      media: media || post.media,
      taggedUsers: taggedUsers || post.taggedUsers,
      visibility: visibility || post.visibility,
    })
    .write();
  res.status(200).json({ message: "Post updated successfully" });
});

server.get("/users/search", (req, res) => {
  const { name } = req.query;
  const users = _router.db
    .get("users")
    .filter((user) => user.firstName.toLowerCase().includes(name.toLowerCase()))
    .value();
  console.log(users);
  res.jsonp(users);
});

/*********************************************************** REACTIONS ***********************************************************/
server.post("/posts/react/:postId", (req, res) => {
  const { postId } = req.params;
  const { reactions, postType } = req.body;

  // Determine which database table to use
  const entityType = postType === "Comment" ? "comments" : "posts";
  const entityTable = _router.db.get(entityType);
  const reactionsTable = _router.db.get("reactions");

  // Find the target entity (post or comment)
  const entity = entityTable.find({ id: postId }).value();
  if (!entity) {
    return res.status(404).json({ error: `${postType} not found` });
  }

  // Check for existing reaction
  const existingReaction = reactionsTable
    .find({
      ["postId"]: postId,
      authorId: currentUser.id,
    })
    .value();

  // Remove existing reaction
  if (existingReaction) {
    reactionsTable.remove({ likeId: existingReaction.likeId }).write();

    // Decrement old reaction count
    entityTable
      .find({ id: postId })
      .assign({
        reactions: {
          ...entity.reactions,
          [existingReaction.type]: Math.max(
            (entity.reactions[existingReaction.type] || 0) - 1,
            0,
          ),
        },
        reactType: null,
      })
      .write();
  }

  // Add new reaction
  const reactionTypeAdd = Object.keys(reactions).find(
    (type) => reactions[type] === 1,
  );
  if (reactionTypeAdd) {
    const newReaction = {
      likeId: `${postId}-${currentUser.id}-${reactionTypeAdd}`,
      ["postId"]: postId,
      authorId: currentUser.id,
      authorType: currentUser.type,
      type: reactionTypeAdd,
      authorName: currentUser.name,
      authorPicture: currentUser.picture,
      authorBio: currentUser.bio,
    };

    reactionsTable.push(newReaction).write();

    // Increment new reaction count
    entityTable
      .find({ id: postId })
      .assign({
        reactions: {
          ...entity.reactions,
          [reactionTypeAdd]: (entity.reactions[reactionTypeAdd] || 0) + 1,
        },
        reactType: reactionTypeAdd,
      })
      .write();
  }

  res.status(200).json({ message: "Reaction updated successfully" });
});

server.get("/posts/reactions/:postId", (req, res) => {
  const { postId } = req.params;
  const reactionsTable = _router.db.get("reactions");
  // Filter reactions for the specified post
  const postReactions = reactionsTable.filter({ postId }).value();
  if (!postReactions || postReactions.length === 0) {
    return res.status(404).json({ error: "No reactions found for this post" });
  }
  res.status(200).json(postReactions);
});

/*********************************************************** SAVE ***********************************************************/
server.get("/posts/saved", (req, res) => {
  const posts = _router.db.get("posts").filter({ isSaved: true }).value();
  res.jsonp(posts);
});

server.post("/posts/save/:postId", (req, res) => {
  const { postId } = req.params;
  const posts = _router.db.get("posts");
  const post = posts.find({ id: postId }).value();
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  posts.find({ id: postId }).assign({ isSaved: true }).write();
  res.status(200).json({ message: "Post saved successfully" });
});

server.delete("/posts/save/:postId", (req, res) => {
  const { postId } = req.params;
  const posts = _router.db.get("posts");
  const post = posts.find({ id: postId }).value();
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  posts.find({ id: postId }).assign({ isSaved: false }).write();
  res.status(200).json({ message: "Post unsaved successfully" });
});

/*********************************************************** COMMENTING ***********************************************************/
server.get("/posts/comments/:postId", (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const startIndex = (page - 1) * limit;

  const comments = _router.db.get("comments").filter({ postId }).value();

  const paginatedComments = comments.slice(startIndex, startIndex + limit);

  if (paginatedComments.length > 0) {
    res.status(200).jsonp(paginatedComments);
  } else {
    res.status(404).jsonp({ message: "No more comments found" });
  }
});

server.post("/posts/comment/:postId", (req, res) => {
  const { postId } = req.params;
  const { content, taggedUsers } = req.body;

  console.log(`Adding comment to postId: ${postId}`);
  console.log(`Comment content: ${content}`);

  const commentId = Date.now().toString();
  const createdAt = new Date().toISOString();

  const newComment = {
    id: commentId,
    postId: postId,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorPicture: currentUser.picture,
    authorBio: currentUser.bio,
    content: content,
    replies: [],
    reactions: {
      Love: 0,
      Celebrate: 0,
      Insightful: 0,
      Funny: 0,
      Support: 0,
      like: 0,
    },
    taggedUsers: taggedUsers || [],
    timestamp: createdAt,
  };

  // Add the comment to the database
  _router.db.get("comments").push(newComment).write();

  // Update the comment count for the post
  const post = _router.db.get("posts").find({ id: postId }).value();

  if (post) {
    _router.db
      .get("posts")
      .find({ id: postId })
      .assign({ comments: (post.comments || 0) + 1 })
      .write();
  }

  // Return the newly created comment
  res.status(201).jsonp(newComment);
});

server.patch("/posts/comments/:commentId", (req, res) => {
  const { commentId } = req.params;
  const { content, taggedUsers } = req.body;

  const data = _router.db.get("comments").find({ id: commentId });
  if (data) {
    data.assign({ content: content }).write();
    return res.status(200).json({ message: "Comment edited successfully" });
  }
  return res.status(404).json({ message: "Comment not found" });
});

server.delete("/posts/comments/:commentId", (req, res) => {
  const { commentId } = req.params;
  const comments = _router.db.get("comments");
  const wantedComment = comments.find({ id: commentId }).value();

  if (wantedComment) {
    const posts = _router.db.get("posts");
    const wantedPost = posts.find({ id: wantedComment.postId }).value();

    if (wantedPost) {
      const setCount = Math.max(wantedPost.comments - 1, 0); // Prevents negative values
      posts
        .find({ id: wantedComment.postId })
        .assign({ comments: setCount })
        .write();

      comments.remove({ id: commentId }).write();
      return res.status(200).json({ message: "Comment deleted successfully" });
    }
  }

  res.status(404).json({ error: "Comment not found" });
});

server.get("/companies/:companyId", (req, res) => {
  console.log("Fetching company details...");

  const companyId = req.params.companyId; // Get companyId from URL
  const company = _router.db
    .get("companies")
    .find({ companyId: companyId })
    .value(); // Find company by ID

  if (!company) {
    return res.status(404).json({ error: "Company not found" });
  }

  res.json(company);
});

//  PATCH - Update company details
server.patch("/companies/:companyId", (req, res) => {
  console.log("Updating company details...");

  const companyId = req.params.companyId;
  const updates = req.body; // Get request body (new company details)

  const company = _router.db.get("companies").find({ companyId: companyId });

  if (!company.value()) {
    return res.status(404).json({ error: "Company not found" });
  }
  company.assign(updates).write();

  res.status(200).json({
    message: "Company details updated successfully",
    updatedCompany: company.value(),
  });
});
//  POST - Create a new company
server.post("/companies", (req, res) => {
  console.log("Creating a new company...");

  const newCompany = req.body; // Get request body (new company data)
  if (!newCompany.companyId || !newCompany.name || !newCompany.description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if company already exists
  const existingCompany = _router.db
    .get("companies")
    .find({ companyId: newCompany.companyId })
    .value();
  if (existingCompany) {
    return res
      .status(409)
      .json({ error: "Company with this ID already exists" });
  }

  _router.db.get("companies").push(newCompany).write(); // Add to database

  res.status(201).json({
    message: "Company page created successfully",
    company: newCompany,
  });
});
// POST - Follow a company
server.post("/companies/:companyId/follow", (req, res) => {
  console.log("Following company...");

  const companyId = req.params.companyId;
  const company = _router.db.get("companies").find({ companyId: companyId });

  if (!company.value()) {
    return res.status(404).json({ error: "Company not found" });
  }

  company.assign({ isFollowing: true }).write();

  res.status(200).json({
    message: "Company followed successfully",
    company: company.value(),
  });
});

// DELETE - Unfollow a company
server.delete("/companies/:companyId/unfollow", (req, res) => {
  console.log("Unfollowing company...");

  const companyId = req.params.companyId;
  const company = _router.db.get("companies").find({ companyId: companyId });

  if (!company.value()) {
    return res.status(404).json({ error: "Company not found" });
  }

  company.assign({ isFollowing: false }).write();

  res.status(200).json({
    message: "Company unfollowed successfully",
    company: company.value(),
  });
});

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});
