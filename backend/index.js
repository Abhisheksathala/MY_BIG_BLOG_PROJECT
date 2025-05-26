import app from "./app.js"
import ConnectDb from "./src/db/indexDb.js"
import { connectCloudinary } from "./src/cloudinary/cloudinary.js"


const PORT = process.env?.PORT || 4000


ConnectDb().then(() => {
    connectCloudinary();
    app.get("/", (req, res) => {
        res.send("hello")
    })
    app.listen(PORT, (req, res) => {
        console.log("listening on port " + PORT)
    })
}).catch((err) => {
    console.log(err)
    process.exit(1)
})



