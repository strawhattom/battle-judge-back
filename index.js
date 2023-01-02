const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileService = require('./files/files.service');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;

const FILE_SIZE_LIMIT = 10000000; // 10 MB max size
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

const multerFilter = (req, file, done) => {
    // TO-DO
    done(null, true);
}
const upload = multer(
    {fileFilter: multerFilter}
);
app.post('/upload', 
    upload.single('file'),
    async (req, res) => {
        console.log("[POST] /upload");
        console.log(req.file);
        if (!req.file) return res.status(404).send({message: "file not found"});
        if (req.file.size > FILE_SIZE_LIMIT) return res.status(413).send({message: "file too large"});
        if (!req.body) return res.status(400).send({message: "can't upload"});

        const file = await fileService.save(req.file);
        if (file) return res.status(200).send({file, message: 'uploaded'});
        return res.status(400).send({message: "error"});
});

app.post('/file', async (req, res) => {
    console.log("[POST] /file");
    const file = await fileService.getAll();
    if (file) return res.status(200).send({files: file, message: "file available"});
    return res.status(400).send({message: "can't get files"});
});

const main = async() => {
    mongoose.set('strictQuery', true); // idk why to remove DeprecationWarning
	mongoose.connect(process.env.MONGO_URI);
	console.log("Connected to mongoDB");
	app.listen(port, () => {
		console.log(`API listening on port ${port}, visit http://localhost:${port}/`)
	})
};

main();
