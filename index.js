const express = require("express");
const app = new express();
app.use(express.static("public"));
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const fileUpload = require("express-fileupload");
app.use(fileUpload());
const expressSession = require("express-session");
app.use(expressSession({ secret: "keyboard cat" }));
const flash = require('connect-flash');
app.use(flash());

const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const validateMiddleware = require("./middleware/validateMiddleware");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const logoutController = require('./controllers/logout')
global.loggedIn = null;
mongoose.connect("mongodb+srv://kartik:S3dkJFVVZDz5tR7T@cluster0.euoxg.mongodb.net/test", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use("/posts/store", validateMiddleware);

let port = process.env.PORT;
if (port == null || port == "") {
 port = 4000;
}

app.listen(port, ()=>{
console.log('App listening...')
})

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

app.get("/", homeController);

app.get("/post/:id", getPostController);

app.get("/posts/new", authMiddleware, newPostController);

app.post(
  "/posts/store",
  authMiddleware,
  validateMiddleware,
  storePostController
);

app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);

app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController
);

app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);

app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController
);

app.get('/auth/logout', logoutController);

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.use((req, res) => res.render('notfound'));
