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

server.patch("/profile/:userId/education/:itemId", (req, res) => {
  const { userId, itemId } = req.params;
  const user = _router.db.get("users").find({ id: String(userId) });
  if (!user.value()) return res.status(404).json({ error: "User not found" });
  const updatedItems = user
    .get("education")
    .map((item) =>
      String(item.id) === itemId ? { ...item, ...req.body } : item
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
      String(item.id) === itemId ? { ...item, ...req.body } : item
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
      String(item.id) === itemId ? { ...item, ...req.body } : item
    )
    .value();
  user.assign({ certifications: updatedItems }).write();
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

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});

////for skills
// server.post("/profile/:id/skills", (req, res) => {
//   const userId = req.params.id;
//   const newItem = { id: Date.now().toString(), ...req.body };

//   const user = _router.db.get("users").find({ id: String(userId) });
//   if (!user.value()) return res.status(404).json({ error: "User not found" });

//   const items = user.get("skills").value() || [];
//   user.assign({ skills: [...items, newItem] }).write();

//   return res.status(201).json(newItem);
// });

// server.patch("/profile/:userId/skills/:itemId", (req, res) => {
//   const { userId, itemId } = req.params;

//   const user = _router.db.get("users").find({ id: String(userId) });
//   if (!user.value()) return res.status(404).json({ error: "User not found" });

//   const updatedItems = user.get("skills")
//     .map((item) =>
//       String(item.id) === itemId ? { ...item, ...req.body } : item
//     )
//     .value();

//   user.assign({ skills: updatedItems }).write();

//   const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
//   res.status(200).json(updatedItem);
// });

// server.delete("/profile/:userId/skills/:itemId", (req, res) => {
//   const { userId, itemId } = req.params;

//   const user = _router.db.get("users").find({ id: String(userId) });
//   if (!user.value()) return res.status(404).json({ error: "User not found" });

//   const filteredItems = user
//     .get("skills")
//     .filter((item) => String(item.id) !== itemId)
//     .value();

//   user.assign({ skills: filteredItems }).write();
//   res.status(204).end();
// });

// editedGeneric

// DELETE specific item in a section
// server.delete("/profile/:userId/:type/:itemId", (req, res) => {
//   const { userId, type, itemId } = req.params;

//   // if (!supportedTypes.includes(type)) {
//   //   return res.status(400).json({ error: "Unsupported type" });
//   // }

//   const user = _router.db.get("users").find({ id: String(userId) });
//   if (!user.value()) return res.status(404).json({ error: "User not found" });

//   const filteredItems = user
//     .get(type)
//     .filter((item) => String(item.id) !== itemId)
//     .value();

//   user.assign({ [type]: filteredItems }).write();
//   res.status(204).end();
// });
// POST new item (education, etc.)
// server.post("/profile/:id/:type", (req, res) => {
//   const userId = req.params.id;
//   const type = req.params.type;
//   const newItem = { id: Date.now().toString(), ...req.body };

//   const user = _router.db.get("users").find({ id: String(userId) });
//   if (!user.value()) return res.status(404).json({ error: "User not found" });

//   const items = user.get(type).value() || [];
//   user.assign({ [type]: [...items, newItem] }).write();
//   return res.status(201).json(newItem); // add return is a must (return data + created id)
// });
// PATCH specific item in a section
// server.patch("/profile/:userId/:type/:itemId", (req, res) => {
//   const { userId, type, itemId } = req.params;

//   // if (!supportedTypes.includes(type)) {
//   //   return res.status(400).json({ error: "Unsupported type" });
//   // }

//   const user = _router.db.get("users").find({ id: String(userId) });
//   if (!user.value()) return res.status(404).json({ error: "User not found" });

//   const updatedItems = user
//     .get(type)
//     .map((item) =>
//       String(item.id) === itemId ? { ...item, ...req.body } : item
//     )
//     .value();

//   user.assign({ [type]: updatedItems }).write();

//   const updatedItem = updatedItems.find((item) => String(item.id) === itemId);
//   res.status(200).json(updatedItem);
// });
