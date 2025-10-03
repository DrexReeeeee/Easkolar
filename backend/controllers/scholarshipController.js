const Scholarship = require('../models/Scholarship');
const {
  generateSummary,
  matchScholarshipsAI,
  getAIEligibilityCheck,
  chatScholarshipAdvisor
} = require('../utils/aiHelper');

exports.createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ scholarship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.findAll({ order: [['deadline', 'ASC']] });
    res.status(200).json({ scholarships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });

    const summary = await generateSummary(
      scholarship.description,
      scholarship.eligibility,
      scholarship.website_link
    );

    res.status(200).json({ scholarship, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });
    await scholarship.update(req.body);
    res.status(200).json({ scholarship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });
    await scholarship.destroy();
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.matchScholarships = async (req, res) => {
  try {
    const userProfile = req.user;
    const allScholarships = await Scholarship.findAll({ order: [['deadline', 'ASC']] });
    const matches = await matchScholarshipsAI(userProfile, allScholarships);
    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkEligibility = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });

    const result = await getAIEligibilityCheck(req.user, scholarship);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.askScholarshipBot = async (req, res) => {
  try {
    const userProfile = req.user;
    const question = req.body.question;
    const allScholarships = await Scholarship.findAll({ limit: 50, order: [['deadline', 'ASC']] });

    const response = await chatScholarshipAdvisor(userProfile, question, allScholarships);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
