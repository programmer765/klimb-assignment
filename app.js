import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import reader from "xlsx";
import async from "async";
import Data from "./Schema.js";
import fs from "fs";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: multerStorage });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const url = `mongodb+srv://admin-aviprit:${process.env.PASSWORD}@cluster0.vdvle.mongodb.net/datadb?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("db is connected");
  Data.createCollection();
});

async function checkAndUploadData(name, data) {
  function checkEmail(currData) {
    return currData.Email === data.Email;
  }

  await Data.findOne({ name: name })
    .then(async (found) => {
      if (!found.candidateData.find(checkEmail)) {
        found.candidateData.push(data);
        await found.save();
      }
    })
    .catch((err) => console.log(err));
}

async function readAndUploadFile(dirname) {
  const data = new Data({
    name: dirname,
    candidateData: [],
  });
  await data.save();
  const filePath = __dirname + "/uploads/" + dirname;
  const file = reader.readFile(filePath);
  const datas = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    raw: false,
  });
  async.eachSeries(datas, async function (item, cb) {
    await checkAndUploadData(dirname, item);
  });
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    else console.log("Deleted");
  });
}

app.post("/upload", upload.single("file"), (req, res) => {
  readAndUploadFile(req.file.filename);
  res.status(200);
  res.send();
});

app.listen(3000, console.log("Server is running"));
