import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router("src/mocks/db.json");
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

server.post("/auth/check-email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const users = _router.db.get("users").value();
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

  const users = _router.db.get("users").value();
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

  _router.db.get("users").push(newUser).write();

  return res.status(201).send();
});

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const users = _router.db.get("users").value();
  const user = users.find(
    (user) => user.email === email && user.password === password
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
  const users = _router.db.get("users").value();

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
    .get("users")
    .find({ id: userId })
    .assign({ password: newPassword })
    .write();

  return res.status(200).json({ message: "Password changed successfully" });
});

server.patch("/users/request-email-update", (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    return res
      .status(400)
      .json({ message: "New email and password are required" });
  }

  const users = _router.db.get("users").value();
  const userId = "1"; // For simplicity
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  const emailExists = users.some(
    (u) => u.email === newEmail && u.id !== userId
  );
  if (emailExists) {
    return res.status(409).json({ message: "Email already exists." });
  }

  return res.status(200).json({
    message: "Confirmation email sent! Please check your new email address.",
    mockData: {
      currentEmail: user.email,
      newEmail,
      confirmationToken: "mock_confirmation_token",
    },
  });
});

server.post("/auth/forgot-password", (req, res) => {
  return res.status(200).json({ 
    message: "If this email exists, a password reset link has been sent" 
  });
});

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});
