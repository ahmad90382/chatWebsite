const express = require("express");
const router = express.Router();

// router.get('/contacts', async(req,res)=>{
//     try {
//         const contacts = global.contacts
//         res.json(contacts);
//     } catch (error) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// })

// router.get('/messages', async(req,res)=>{
//     try {
//         const messages = global.messages;
//         res.json(messages);
//     } catch (error) {
//         console.log(error)
//         res.status(500).send('Server Error');
//     }
// })

// router.get("/users", async (req, res) => {
//   try {
//     const users = global.users;
//     res.json(users);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
