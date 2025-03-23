import pkg from "json-server";
const { create, router, defaults, bodyParser } = pkg;
const server = create();
const _router = router(
  "C:/Users/Aisha/Desktop/software/linkedIn/Front-end/src/mocks/db.json"
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
// GET a specific company by ID
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
server.use(_router);

server.listen(5000, () => {
  console.log("Mock server running at http://localhost:5000");
});
