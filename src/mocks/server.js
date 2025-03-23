import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router(
  "C:/Users/ASUS/Desktop/sw project/Front-end/src/mocks/db.json"
);
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

// GET /profile/:id → Get user profile by ID
server.get("/profile/:id", (req, res) => {
  const userId = parseInt(req.params.id); // convert id to number
  const users = _router.db.get("users").value(); // get all users
  const user = users.find((u) => u.id === userId); // find user by ID

  if (user) {
    res.jsonp(user);
  } else {
    res.status(404).jsonp({ error: "User not found" });
  }
});

// PATCH /profile → Update user data in header
// ✅ CORRECT PATCH HANDLER
server.patch("/profile", (req, res) => {
  const users = _router.db.get("users").value();
  const { id, ...updates } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const updatedUser = { ...users[userIndex], ...updates };

  _router.db.get("users").find({ id }).assign(updatedUser).write();

  res.status(200).json(updatedUser);
});

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});
