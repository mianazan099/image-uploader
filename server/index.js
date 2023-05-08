import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();
const PORT = 3000 || process.env.PORT;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, { fieldname, originalname }, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = originalname.toLowerCase().replace(/ /g, "-");
    const fileName = `${fieldname}-${uniqueSuffix}-${originalName}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.use("/image", express.static("uploads"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({ url: `/image/${req.file.filename}` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));