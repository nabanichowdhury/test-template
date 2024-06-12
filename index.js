const express = require("express");

const { createPlan } = require("./functions/myFunction");
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// API to test the 'add' function
app.post("/api/test-post", (req, res) => {
  const data = req.body;
  console.log(data);

  const result = createPlan(data);
  res.json({ result });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
