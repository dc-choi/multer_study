const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; ++i) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'uploads/imgs');
		},
		filename: function (req, file, cb) {
			const parsed = file.originalname.split('.');
            const filename = Array.isArray(parsed) && parsed?.length > 0 ? parsed[0] : '';
            const ext = Array.isArray(parsed) && parsed?.length > 1 ? parsed[1] : '';

            let obj = `${generateRandomString(32)}.${filename}`;
            if (ext.length > 0) {
                obj += `.${ext}`;
            }

			cb(null, obj);
		}
	})
});

/**
 * Content-Type이 multipart/form-data으로 들어옴.
 */
app.post('/upload', upload.array('imgs'), async (req, res) => {
	console.log(req.files);
	console.log(req.body);
	res.status(200).json({ result: 'OK' });
});

module.exports = app;
