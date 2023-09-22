const mongoose =require ("mongoose")
require("dotenv").config()


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}.mongodb.net/?retryWrites=true&w=majority`)
.then(console.log("Code 200"))
.catch(err => console.error(err))

module.exports = mongoose