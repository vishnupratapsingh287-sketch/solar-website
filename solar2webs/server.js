// ====================================
// SunForce Solar - Backend Server
// ====================================
// To run this:
// 1. Install Node.js from https://nodejs.org
// 2. Open terminal/command prompt in this folder
// 3. Run: npm install
// 4. Run: node server.js
// 5. Server will start at http://localhost:3000
// ====================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Read JSON data
app.use(express.static('./')); // Serve your HTML/CSS/JS files

// ===== FILE TO STORE CONTACT MESSAGES =====
const DB_FILE = 'contacts.json';

// Create contacts file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Helper: read all contacts
function readContacts() {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper: save contacts
function saveContacts(contacts) {
  fs.writeFileSync(DB_FILE, JSON.stringify(contacts, null, 2));
}

// ===== ROUTES =====

// HOME - Serve the website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// CONTACT FORM - Receive and save messages
app.post('/api/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  // Create new contact entry
  const newContact = {
    id: Date.now(),
    name,
    email,
    phone: phone || 'Not provided',
    service: service || 'Not specified',
    message: message || 'No message',
    date: new Date().toLocaleString(),
    status: 'new'
  };

  // Save to file
  const contacts = readContacts();
  contacts.push(newContact);
  saveContacts(contacts);

  console.log(`📬 New contact from: ${name} (${email})`);

  res.status(200).json({ message: 'Message received successfully!' });
});

// ADMIN - View all contact messages (open in browser)
app.get('/admin/contacts', (req, res) => {
  const contacts = readContacts();

  // Build a simple HTML table to view messages
  let rows = contacts.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.service}</td>
      <td>${c.message}</td>
      <td>${c.date}</td>
      <td><span style="color: ${c.status === 'new' ? '#F5A623' : '#2ECC71'}">${c.status}</span></td>
    </tr>
  `).join('');

  if (contacts.length === 0) {
    rows = '<tr><td colspan="8" style="text-align:center;color:#888">No messages yet.</td></tr>';
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Admin - Contact Messages</title>
    <style>
      body { font-family: sans-serif; background: #0D1117; color: #E6EDF3; padding: 2rem; }
      h1 { color: #F5A623; margin-bottom: 1.5rem; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #161B22; padding: 0.8rem; text-align: left; color: #F5A623; border-bottom: 2px solid #F5A623; }
      td { padding: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 0.9rem; color: #8B949E; }
      tr:hover td { background: rgba(245,166,35,0.05); }
      .count { background: rgba(245,166,35,0.15); padding: 0.3rem 0.8rem; border-radius: 20px; margin-left: 1rem; font-size: 0.8rem; }
    </style>
  </head>
  <body>
    <h1>☀️ SunForce - Contact Messages <span class="count">${contacts.length} total</span></h1>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
          <th>Service</th><th>Message</th><th>Date</th><th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
  </html>`;

  res.send(html);
});

// GET all contacts as JSON (for API use)
app.get('/api/contacts', (req, res) => {
  const contacts = readContacts();
  res.json(contacts);
});

// DELETE a contact by ID
app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let contacts = readContacts();
  contacts = contacts.filter(c => c.id !== id);
  saveContacts(contacts);
  res.json({ message: 'Contact deleted.' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log('');
  console.log('☀️  SunForce Solar Backend is RUNNING!');
  console.log('=====================================');
  console.log(`🌐  Website:  http://localhost:${PORT}`);
  console.log(`📬  Admin:    http://localhost:${PORT}/admin/contacts`);
  console.log(`🔌  API:      http://localhost:${PORT}/api/contact`);
  console.log('=====================================');
  console.log('Press CTRL+C to stop the server.');
  console.log('');

});
