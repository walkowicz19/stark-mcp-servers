const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class CredentialVault {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.saltLength = 64;
    this.ivLength = 16;
    this.iterations = 100000;
    this.keyPath = path.join(__dirname, '../.vault-key');
    this.adminPasswordPath = path.join(__dirname, '../.admin-password');
    this.sessionTokens = new Map();
    this.sessionTimeout = 24 * 60 * 60 * 1000;
    this.ensureMasterKey();
  }

  ensureMasterKey() {
    if (!fs.existsSync(this.keyPath)) {
      const masterKey = crypto.randomBytes(this.keyLength);
      fs.writeFileSync(this.keyPath, masterKey.toString('hex'), { mode: 0o600 });
      console.log('Generated new master encryption key');
    }
  }

  getMasterKey() {
    const keyHex = fs.readFileSync(this.keyPath, 'utf8');
    return Buffer.from(keyHex, 'hex');
  }

  encrypt(data) {
    const key = this.getMasterKey();
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encrypted, iv, authTag) {
    const key = this.getMasterKey();
    const decipher = crypto.createDecipheriv(this.algorithm, key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  hashPassword(password, salt = null) {
    const actualSalt = salt || crypto.randomBytes(this.saltLength);
    const hash = crypto.pbkdf2Sync(password, actualSalt, this.iterations, this.keyLength, 'sha256');
    return { hash: hash.toString('hex'), salt: actualSalt.toString('hex') };
  }

  verifyPassword(password, hash, salt) {
    const { hash: computedHash } = this.hashPassword(password, Buffer.from(salt, 'hex'));
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  }

  async setAdminPassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    const { hash, salt } = this.hashPassword(password);
    const data = JSON.stringify({ hash, salt, created: new Date().toISOString() });
    fs.writeFileSync(this.adminPasswordPath, data, { mode: 0o600 });
  }

  async verifyAdminPassword(password) {
    if (!this.isPasswordConfigured()) {
      throw new Error('Admin password not configured');
    }
    try {
      const data = JSON.parse(fs.readFileSync(this.adminPasswordPath, 'utf8'));
      return this.verifyPassword(password, data.hash, data.salt);
    } catch (error) {
      return false;
    }
  }

  isPasswordConfigured() {
    return fs.existsSync(this.adminPasswordPath);
  }

  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  storeSessionToken(token, context) {
    this.sessionTokens.set(token, {
      context,
      created: Date.now(),
      expires: Date.now() + this.sessionTimeout
    });
    this.cleanExpiredTokens();
  }

  verifySessionToken(token) {
    const session = this.sessionTokens.get(token);
    if (!session) return false;
    if (Date.now() > session.expires) {
      this.sessionTokens.delete(token);
      return false;
    }
    return true;
  }

  cleanExpiredTokens() {
    const now = Date.now();
    for (const [token, session] of this.sessionTokens.entries()) {
      if (now > session.expires) {
        this.sessionTokens.delete(token);
      }
    }
  }
}

module.exports = CredentialVault;
