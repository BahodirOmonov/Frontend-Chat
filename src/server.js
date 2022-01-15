import express from "express"
import { PORT } from "../config.js"
import ejs from "ejs"
import path from "path"

const app = express()

app.set("views", path.join(process.cwd(), "src", "views"))
app.engine("html", ejs.renderFile)
app.set("view engine", "html")
app.use(express.static(path.join(process.cwd(), "src", "public")))

app.get("/", (req, res, next) => res.render("index"))
app.get("/register", (req, res, next) => res.render("register"))
app.get("/login", (req, res, next) => res.render("login"))


app.listen(PORT, console.log("Server is running on http://localhost:" + PORT))