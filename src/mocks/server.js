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

server.post("/auth/forgot-password", (req, res) => {
  return res.status(200).json({ 
    message: "If this email exists, a password reset link has been sent" 
  });
});

// Add these endpoints to your existing server.js
server.get("/users/confirm-email-change", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // Mock token verification - in real app this would check your database
  const users = _router.db.get("users").value();
  const pendingChanges = _router.db.get("pendingEmailChanges").value() || [];
  
  const changeRequest = pendingChanges.find(req => req.token === token);
  
  if (!changeRequest) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Update user's email
  const user = users.find(u => u.id === changeRequest.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.email = changeRequest.newEmail;
  _router.db.get("users").find({ id: changeRequest.userId }).assign(user).write();
  
  // Remove the pending change
  _router.db.set("pendingEmailChanges", pendingChanges.filter(req => req.token !== token)).write();

  return res.status(200).json({ message: "Email updated successfully" });
});

server.patch("/users/request-email-update", (req, res) => {
  const { newEmail, password } = req.body;
  const users = _router.db.get("users").value();
  
  const userId = "1"; // For simplicity
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  if (user.password !== password) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  
  if (users.some(u => u.email === newEmail)) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const token = `mock_token_${Math.random().toString(36).substring(2, 9)}`;
  const pendingChanges = _router.db.get("pendingEmailChanges").value() || [];
  
  _router.db.set("pendingEmailChanges", [
    ...pendingChanges,
    {
      userId,
      newEmail,
      token,
      createdAt: new Date().toISOString()
    }
  ]).write();

  const verificationLink = `http://localhost:5173/auth/email-token-verification?token=${token}`;
  console.log(`Mock verification email sent with link: ${verificationLink}`);

  return res.status(200).json({ 
    message: "Verification email sent",
    mockVerificationLink: verificationLink // For testing
  });
});

server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});
