const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

// MongoDB Connection
const dbURI = 'mongodb://localhost:27017/myapp';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Schema and Model for Contact
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

// POST Route for Contact Form
app.post('/submit_contact', (req, res) => {
  console.log('Received data:', req.body);

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });

  contact
    .save()
    .then(() => {
      res.send(`
        <html>
          <head>
            <link rel="stylesheet" href="contact.css">
          </head>
          <body class="slide">
            <div class="HOME-ABOUT-ME">
              <a href="index.html">HOME</a>
              <a href="about-me.html">ABOUT ME</a>
              <a href="services.html">SERVICES</a>
              <a href="portfolio.html">PORTFOLIO</a>
              <a href="contact.html">CONTACT</a>
            </div>
            <div class="overlap-group">
              <div class="content">
                <h2>Thank you for contacting us!</h2>
                <p>We will get back to you soon.</p>
                <a href="/">Back to home</a>
              </div>
            </div>
          </body>
        </html>
      `);
    })
    .catch((err) => {
      console.error('Error saving contact to MongoDB:', err);
      res
        .status(500)
        .send('Sorry, something went wrong. Please try again later.');
    });
});

// Start Server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
