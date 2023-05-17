const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const multer = require("multer");

const app = express();
const PORT = 5000 || process.env.PORT;

// Multer Settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, { fieldname, originalname }, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = originalname.toLowerCase().replace(/ /g, "-");
    const fileName = `${fieldname}-${uniqueSuffix}-${originalName}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Make the uploads folder static
const staticImageRoute = "/uploads/image";
app.use(staticImageRoute, express.static("uploads"));

// Image uploader route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please send a image file");
  }
  res.status(200).json({ url: `${staticImageRoute}/${req.file.filename}` });
});

// Check if in production mode
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).send("You are in development mode");
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
