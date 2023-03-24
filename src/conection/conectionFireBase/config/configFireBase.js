const serviceAcount = require("./form-in-session-firebase-adminsdk-yp5yq-9b73abe6c4.json")
const admin = require("firebase-admin")

admin.initializeApp({credential: admin.credential.cert(serviceAcount)})
module.exports = (colecion) =>{
    const db = admin.firestore()
    const conectarA = db.collection(colecion)
    return conectarA
}
