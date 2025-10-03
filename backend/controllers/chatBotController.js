const Scholarship = require('../models/Scholarship');
const { chatScholarshipAdvisor } = require('../utils/aiHelper');

exports.askScholarshipBot = async (req, res) => {
  try {
    const userProfile = req.user;
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ message: 'Question is required.' });
    }


    const scholarships = await Scholarship.findAll({
      order: [['deadline', 'ASC']],
      limit: 50
    });

    const response = await chatScholarshipAdvisor(userProfile, question, scholarships);

    res.status(200).json({ response });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ message: 'Unable to answer your question at the moment.' });
  }
};
