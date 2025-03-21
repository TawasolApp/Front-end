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

server.get("/posts", (req, res) => {
  console.log('called');
  const posts = _router.db.get("posts").value();
  console.log(posts);
  res.jsonp(posts);
})

server.post('/posts', (req, res) => {
  console.log('called');
})

server.get("/comments", (req, res) => {
  console.log("called comments");
  const comments = _router.db.get("comments").value();
  console.log(comments);
  res.jsonp(comments);
})

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});