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

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});