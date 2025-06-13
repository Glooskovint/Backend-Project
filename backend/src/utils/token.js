const crypto = require('crypto');

function generateInviteToken() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  generateInviteToken,
};
