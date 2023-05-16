const fs = require('fs/promises');
const path = require("path");
const {nanoid} = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const updateContacts = async (contacts) => await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
   return JSON.parse(data);
}

const getContactById = async (id) => {
  const contacts = await listContacts();
    const data = contacts.find(item => item.id === id);
    return data || null;
}

const removeContact = async (id) => {
  const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if (index === -1) {
        return null;
    }
    const [data] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return data;
}

const addContact = async (data) => {
  const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data,
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

const updateContact = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = {id, ...data};
  await updateContacts(contacts);
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
