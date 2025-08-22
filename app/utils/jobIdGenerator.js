const Job = require('../models/job');

const generateJobId = async () => {
  const year = new Date().getFullYear();
  
  // Count existing jobs for this year
  const count = await Job.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`)
    }
  });

  const sequence = (count + 1).toString().padStart(3, '0'); // 000 format

  const jobId = `JOB/${year}/${sequence}`;
  return jobId;
};

module.exports = generateJobId;
