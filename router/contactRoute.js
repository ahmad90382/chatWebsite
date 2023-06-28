const express = require('express');
const router = express.Router();
const createContacts = require('../models/contactSchema');

router.post('/createContact', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(422).json({ error: "Enter All Info" });
    }

    const Contacts = await createContacts();

    if (!Contacts) {
      return res.status(500).json({ error: "Contacts not available" });
    }

    const userExists = await Contacts.findOne({ phone: phone });
    if (userExists) {
      return res.status(422).json({ error: "alreadyAvaliable" });
    }

    const newContact = new Contacts({ name, phone });
    await newContact.save();

    res.status(201).json({ message: 'created' });
    // res.status(201).json({ message: 'Contact created successfully' });
    console.log('ok')

  } catch (error) {
    console.log("->" + error);
    res.status(500).json({ message: 'Error -> ' + error });
  }
});




router.delete('/deleteContact/:id', async (req, res) => {
  try {
    const contactId = req.params.id;

    const Contacts = await createContacts();

    if (!Contacts) {
      return res.status(500).json({ error: "Contacts not available" });
    }

    const deletedContact = await Contacts.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.log("->" + error);
    res.status(500).json({ message: 'Error -> ' + error });
  }
});










module.exports = router;