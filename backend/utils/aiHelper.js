const axios = require('axios');
require('dotenv').config();

const generateSummary = async (description, eligibility) => {
  const prompt = `Summarize the following scholarship description and eligibility into 3-5 key bullet points:\n
  Description: ${description}\n
  Eligibility: ${eligibility}\n`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful scholarship summarizer.' },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI summarization error:', error.message);
    return description.substring(0, 200) + '...';
  }
};

const getAIEligibilityCheck = async (profile, scholarship) => {
  const prompt = `User Profile:\n
  Name: ${profile.name}\n
  Email: ${profile.email}\n
  Course: ${profile.course}\n
  GPA: ${profile.gpa}\n
  Location: ${profile.location}\n
  Preferred Fields: ${profile.preferred_fields}\n

  Scholarship:\n
  Name: ${scholarship.name}\n
  Description: ${scholarship.description}\n
  Eligibility: ${scholarship.eligibility}\n

  Question: Is this user eligible for this scholarship? Answer Yes or No and explain why in a few sentences.`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an assistant that determines scholarship eligibility.' },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI eligibility error:', error.message);
    return 'Unable to determine eligibility at the moment.';
  }
};

const matchScholarshipsAI = async (profile, scholarships) => {
  const prompt = `User Profile:\n
  Name: ${profile.name}\n
  Course: ${profile.course}\n
  GPA: ${profile.gpa}\n
  Location: ${profile.location}\n
  Preferred Fields: ${profile.preferred_fields}\n

  Here are a list of scholarships (with name, description, and eligibility):
  ${scholarships.map(s => `- ${s.name}: ${s.description}. Eligibility: ${s.eligibility}`).join('\n')}

  Based on the profile, rank the most relevant scholarships (max 5) with a short explanation for each match.
  Format as a list with ranking and reason.
  `;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that ranks scholarships based on user profiles.' },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI matching error:', error.message);
    return 'Unable to match scholarships at the moment.';
  }
};

module.exports = {
  generateSummary,
  getAIEligibilityCheck,
  matchScholarshipsAI
};
