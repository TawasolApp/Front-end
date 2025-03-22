import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router("src/mocks/db.json");
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

const currentUser = {
  id: "mohsobh",
  name: "Mohamed Sobh",
  picture: "https://media.licdn.com/dms/image/v2/D4D03AQH7Ais8BxRXzw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1721080103981?e=1747872000&v=beta&t=nDnZdgCqkI8v5B2ymXZzluMZVlF6h_o-dN1pA95Fzv4",
  bio: "Computer Engineering Student at Cairo University",
  type: "User"
};



// GET ADD DELETE EDIT POSTS
server.get("/posts", (req, res) => {
  const posts = _router.db.get("posts").value();
  res.jsonp(posts);
})

server.post('/posts', (req, res) => {
  const { authorId, content, media, taggedUsers, visibility } = req.body;

  // Basic validation
  if (!authorId || !content) {
      return res.status(400).json({ error: 'authorId and content are required' });
  }

  const newPost = {
      id: uuidv4(),
      isSaved: false,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorPicture: currentUser.picture,
      authorBio: currentUser.bio,
      content,
      media: media || [],
      reactions: {
          Love: 0,
          Celebrate: 0,
          Insightful: 0,
          Funny: 0,
          Support: 0,
          Like: 0
      },
      comments: 0,
      shares: 0,
      taggedUsers: taggedUsers || [],
      visibility,
      authorType: "User",
      reactType: "",
      repostDetails: {},
      timestamp: new Date().toISOString()
  };

  // Access the existing posts
  const db = router.db; // Get reference to db.json
  const posts = db.get('posts');

  // Add the new post and persist the change
  posts.push(newPost).write();

  res.status(201).json(newPost);
});

server.delete('/delete/:postId', (req, res) => {
  const { postId } = req.params;

  // Access the database
  const db = router.db; // Reference to db.json
  const posts = db.get('posts');

  // Find the post
  const postToDelete = posts.find({ id: postId }).value();

  if (!postToDelete) {
      return res.status(404).json({ error: 'Post not found' });
  }

  // Remove the post and persist the change
  posts.remove({ id: postId }).write();

  res.status(200).json({ message: 'Post deleted successfully' });
});

server.patch('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  const { authorId, content, media, taggedUsers, visibility } = req.body;

  // Access the database
  const db = router.db;
  const posts = db.get('posts');

  // Find the post
  const post = posts.find({ id: postId }).value();

  if (!post) {
      return res.status(404).json({ error: 'Post not found' });
  }

  // Update post details
  posts
      .find({ id: postId })
      .assign({
          authorId: authorId || post.authorId, // Maintain existing data if no update provided
          content: content || post.content,
          media: media || post.media,
          taggedUsers: taggedUsers || post.taggedUsers,
          visibility: visibility || post.visibility,
          timestamp: new Date().toISOString() // Update timestamp for modification tracking
      })
      .write();

  const updatedPost = posts.find({ id: postId }).value();

  res.status(200).json({ message: 'Post updated successfully', updatedPost });
});

// REACT TO POST (ADD AND DELETE)
server.post('/posts/react/:postId', (req, res) => {
  const { postId } = req.params;
  const { reactions, postType } = req.body;

  const db = router.db;
  const posts = db.get('posts');
  const reactionsTable = db.get('reactions');

  const post = posts.find({ id: postId }).value();
  if (!post) {
      return res.status(404).json({ error: 'Post not found' });
  }

  // Remove existing reaction by this author
  const existingReaction = reactionsTable
      .find({ postId, authorId: currentUser.id })
      .value();

  if (existingReaction) {
      reactionsTable.remove({ likeId: existingReaction.likeId }).write();

      // Subtract 1 from the old reaction type in the posts table
      if (existingReaction.type && post.reactions[existingReaction.type] > 0) {
          posts
              .find({ id: postId })
              .assign({
                  reactions: {
                      ...post.reactions,
                      [existingReaction.type]: post.reactions[existingReaction.type] - 1
                  }
              })
              .write();
      }
  }

  // Add the new reaction if requested
  const reactionTypeAdd = Object.keys(reactions).find(type => reactions[type] === 1);

  if (reactionTypeAdd) {
      const newReaction = {
          likeId: `${postId}-${currentUser.id}-${reactionTypeAdd}`,
          postId,
          authorId: currentUser.id,
          authorType: currentUser.type,
          type: reactionTypeAdd,
          authorName: currentUser.name,
          authorPicture: currentUser.picture,
          authorBio: currentUser.bio
      };

      reactionsTable.push(newReaction).write();

      // Add 1 to the new reaction type in the posts table
      posts
          .find({ id: postId })
          .assign({
              reactions: {
                  ...post.reactions,
                  [reactionTypeAdd]: (post.reactions[reactionTypeAdd] || 0) + 1
              }
          })
          .write();
  }

  res.status(200).json({ message: 'Reaction updated successfully' });
});

server.get('/posts/reactions/:postId', (req, res) => {
  const { postId } = req.params;

  const db = router.db;
  const reactionsTable = db.get('reactions');

  // Filter reactions for the specified post
  const postReactions = reactionsTable
      .filter({ postId })
      .value();

  if (!postReactions || postReactions.length === 0) {
      return res.status(404).json({ error: 'No reactions found for this post' });
  }

  res.status(200).json(postReactions);
});

// SAVE UNSAVE POSTS
server.post('/posts/save/:postId', (req, res) => {
  const { postId } = req.params;

  // Access the database
  const db = router.db;
  const posts = db.get('posts');

  // Find the post
  const post = posts.find({ id: postId }).value();

  if (!post) {
      return res.status(404).json({ error: 'Post not found' });
  }

  // Update `isSaved` to true
  posts.find({ id: postId }).assign({ isSaved: true }).write();

  res.status(200).json({ message: 'Post saved successfully' });
});

server.delete('/posts/save/:postId', (req, res) => {
  const { postId } = req.params;

  const db = router.db;
  const posts = db.get('posts');

  const post = posts.find({ id: postId }).value();

  if (!post) {
      return res.status(404).json({ error: 'Post not found' });
  }

  // Update `isSaved` to false
  posts.find({ id: postId }).assign({ isSaved: false }).write();

  res.status(200).json({ message: 'Post unsaved successfully' });
});


server.get("/posts/comments/:postId", (req, res) => {
  const { postId } = req.params;
  console.log(`Fetching comments for postId: ${postId}`);

  const comments = _router.db
    .get("comments")
    .filter({ postId })
    .value();

  console.log(comments);
  res.jsonp(comments);
});

// POST endpoint to add a new comment to a post
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
      "love": 0,
      "celebrate": 0,
      "insightful": 0,
      "funny": 0,
      "support": 0,
      "like": 0
    },
    taggedUsers: taggedUsers || [],
    timestamp: createdAt
  };
  
  // Add the comment to the database
  _router.db
    .get("comments")
    .push(newComment)
    .write();
  
  // Update the comment count for the post
  const post = _router.db
    .get("posts")
    .find({ id: postId })
    .value();
    
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

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});