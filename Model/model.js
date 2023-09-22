const mongoose = require("mongoose")


const inscription_Schema = new mongoose.Schema({
    nom: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    repetedPassword: { type: String, required: true },
    photo: [String],
    date: { type: Date, default: Date.now },
    role: { type: String, required: true },
    token: { type: String },
})






module.exports = mongoose.model("userInscription", inscription_Schema)

