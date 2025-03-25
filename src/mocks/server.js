import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router(
  "C:/Users/ASUS/Desktop/sw project/Front-end/src/mocks/db.json"
);
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

const supportedTypes = ["education", "experience", "skills", "certifications"];
// GET all users
server.get("/profile", (req, res) => {
  const users = _router.db.get("users").value();
  res.status(200).json(users);
});

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

// POST new item (education, etc.)
server.post("/profile/:id/:type", (req, res) => {
  const userId = req.params.id;
  const type = req.params.type;
  const newItem = { id: Date.now().toString(), ...req.body };

  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });

  const items = user.get(type).value() || [];
  user.assign({ [type]: [...items, newItem] }).write();

  res.status(201).json(newItem);
});

// PATCH specific item in a section
server.patch("/profile/:userId/:type/:itemId", (req, res) => {
  const { userId, type, itemId } = req.params;

  if (!supportedTypes.includes(type)) {
    return res.status(400).json({ error: "Unsupported type" });
  }

  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });

  const updatedItems = user
    .get(type)
    .map((item) =>
      String(item.id) === itemId ? { ...item, ...req.body } : item
    )
    .value();

  user.assign({ [type]: updatedItems }).write();

  const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
  res.status(200).json(updatedItem);
});

// DELETE specific item in a section
server.delete("/profile/:userId/:type/:itemId", (req, res) => {
  const { userId, type, itemId } = req.params;

  if (!supportedTypes.includes(type)) {
    return res.status(400).json({ error: "Unsupported type" });
  }

  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });

  const filteredItems = user
    .get(type)
    .filter((item) => String(item.id) !== itemId)
    .value();

  user.assign({ [type]: filteredItems }).write();
  res.status(204).end();
});

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});
