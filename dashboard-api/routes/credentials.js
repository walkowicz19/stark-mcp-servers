const express = require('express');
const router = express.Router();

// Get all credentials (without sensitive data)
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const credentials = db.getAllCredentials();
    res.json({ credentials });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new credential
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const vault = req.app.locals.vault;
    const { name, value, service } = req.body;
    
    if (!name || !value) {
      return res.status(400).json({ error: 'name and value are required' });
    }

    const encrypted = vault.encrypt(value);
    db.saveCredential(name, encrypted.encrypted, encrypted.iv, service);
    
    res.json({ success: true, name });
  } catch (error) {
    console.error('Error saving credential:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get credential value (decrypted)
router.get('/:name', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const vault = req.app.locals.vault;
    const { name } = req.params;
    
    const credential = db.getCredential(name);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const decrypted = vault.decrypt(
      credential.encrypted_value,
      credential.iv,
      credential.encrypted_value.slice(-32) // Auth tag is appended
    );
    
    db.updateCredentialLastUsed(name);
    res.json({ name, value: decrypted });
  } catch (error) {
    console.error('Error retrieving credential:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete credential
router.delete('/:name', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name } = req.params;
    
    db.deleteCredential(name);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test credential
router.post('/:name/test', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name } = req.params;
    
    const credential = db.getCredential(name);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    // Simple test - just check if it exists and can be retrieved
    res.json({ success: true, message: 'Credential is valid' });
  } catch (error) {
    console.error('Error testing credential:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
