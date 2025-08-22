const Candidate = require('../models/candidate');

const generateUserId = async () => {
  const date = new Date();
  const prefix = `CAND${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`;

  const count = await Candidate.countDocuments({ createdAt: { $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()) } });
  const serial = (count + 1).toString().padStart(3, '0');

  return `${prefix}${serial}`;
}

module.exports = generateUserId;
