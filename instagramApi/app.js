const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const {v4: uuid4} = require('uuid');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
const dataPath = "./fakeDB/db.json"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.use(multer({dest: "upload"}).single("filedata"));


const getData = () => {
    let data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}
const saveData = (data) => {
    let stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}
//localhost:3000/users/register
app.post('/users/register', (req, res) => {
    let data = getData()
    let id = uuid4();
    let password = req.body.password;
    if (password.length > 10) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (!err) {
                    let obj = {
                        "id": id,
                        "username": req.body.username,
                        "email": req.body.email,
                        "password": hash,
                        "token": ""
                    }
                    data['users'].push(obj);
                    saveData(data);
                    res.send("Registration successfully, go ahead and login")
                } else {
                    res.sendStatus(401);
                }
            })
        })
    }
})
//localhost:3000/users/login
app.post("/users/login", (req, res) => {
    let data = getData();
    let token = uuid4();
    let email = data['users'].map((element) => {
        return element.email;
    })
    let obj = data['users'].find(element => {
        if (element.email == req.body.email) {
            return element;
        }
    })
    let index = data['users'].indexOf(obj);
    if (email.includes(req.body.email)) {
        bcrypt.compare(req.body.password, obj.password, function (err, result) {
            if (result) {
                setTimeout(() => {
                    data['users'][index]['token'] = token
                    saveData(data);
                }, 10000);
                res.send("Ok!!!")
            } else {
                res.send("Invalid password")
            }
            res.send("Ok!!!")
        });
    } else {
        res.send("Invalid email")
    }
})
//localhost:3000/photos/upload/:Id
app.post('/users/upload/:id', (req, res) => {

    let filedata = req.file;
    let data = getData();
    let userId = req.params.id;
    let user = data['users'].map((element) => {
        if (element.id === userId) {
            return element;
        }
    })
    let token = user[token];
    console.log(token);
    if (token) {
        if (!filedata) {
            res.send('No file is selected.')
        } else {
            if (filedata.mimetype === "image/png" ||
                filedata.mimetype === "image/jpg" ||
                filedata.mimetype === "image/jpeg") {
                let photo = {
                    "id": uuid4(),
                    "title": filedata.filename,
                    "path": filedata.path,
                    "userId": userId
                }
                data['users'].push(photo);
                saveData(data);
                res.send('Photos are uploaded.');
            }
        }
    } else {
        res.send("Invalid token");
    }
});

    const port = 3000;

    app.listen(port, () =>
    console.log(`Server started on port ${port}`));

