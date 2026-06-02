import express from 'express';
import { Contact } from '../models/Contact.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for contact form
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: { error: 'Too many contact submissions, please try again later.' }
});

// POST /api/contact
router.post('/', contactRateLimit, async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email, and message are required'
      });
    }

    // Create contact record
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || '',
      message: message.trim()
    });

    await contact.save();

    // In a real app, you might want to send an email notification here
    console.log('📧 New contact form submission:', {
      name: contact.name,
      email: contact.email,
      company: contact.company
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      id: contact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        error: 'Validation error',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Failed to submit contact form. Please try again.'
    });
  }
});

// GET /api/contact (for admin - get all contacts)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      contacts: contacts.map(contact => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        company: contact.company,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt
      }))
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contacts'
    });
  }
});

export default router;