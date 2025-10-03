const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

//extracts full page text and sends to OpenRouter AI for structured field extraction
const extractScholarshipDetailsFromWebsite = async (websiteLink) => {
  try {
    const { data } = await axios.get(websiteLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);

    const prompt = `
From the text below, extract and return the structured scholarship details:

Format like this:
Description: <full scholarship benefits, purpose, scope, etc.>
Eligibility: <eligibility criteria such as age, GPA, location, financial need, etc.>

Text:
${text}
    `;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI that extracts structured scholarship data.' },
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
    console.error('Error extracting scholarship info:', error.message);
    return null;
  }
};

const generateSummary = async (description, eligibility, websiteLink = '') => {
  let desc = description || '';
  let elig = eligibility || '';
  const isDescShort = !desc || desc.length < 100;
  const isEligShort = !elig || elig.length < 100;

  if ((isDescShort || isEligShort) && websiteLink) {
    const extracted = await extractScholarshipDetailsFromWebsite(websiteLink);
    if (extracted) {
      const matchDesc = extracted.match(/Description:\s*(.+?)Eligibility:/s);
      const matchElig = extracted.match(/Eligibility:\s*(.+)/s);
      if (matchDesc) desc = matchDesc[1].trim();
      if (matchElig) elig = matchElig[1].trim();
    }
  }

  const prompt = `Summarize the following scholarship description and eligibility into 3-5 key bullet points:\n\nDescription: ${desc}\n\nEligibility: ${elig}`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
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
    return desc.substring(0, 200) + '...';
  }
};

const getAIEligibilityCheck = async (profile, scholarship) => {
  const prompt = `User Profile:
Name: ${profile.name}
Email: ${profile.email}
Course: ${profile.course}
GPA: ${profile.gpa}
Location: ${profile.location}
Preferred Fields: ${profile.preferred_fields}

Scholarship:
Name: ${scholarship.name}
Description: ${scholarship.description}
Eligibility: ${scholarship.eligibility}

Question: Is this user eligible for this scholarship? Answer Yes or No and explain why in a few sentences.`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
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
  const prompt = `User Profile:
Name: ${profile.name}
Course: ${profile.course}
GPA: ${profile.gpa}
Location: ${profile.location}
Preferred Fields: ${profile.preferred_fields}

Here are a list of scholarships (with name, description, and eligibility):
${scholarships.map(s => `- ${s.name}: ${s.description}. Eligibility: ${s.eligibility}`).join('\n')}

Based on the profile, rank the most relevant scholarships (max 5) with a short explanation for each match.
Format as a list with ranking and reason.
`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
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

const chatScholarshipAdvisor = async (profile, question, scholarships) => {
  const scholarshipList = scholarships.slice(0, 30).map(s => (
    `- ${s.name}:\nDescription: ${s.description || 'N/A'}\nEligibility: ${s.eligibility || 'N/A'}\n`
  )).join('\n');

  const prompt = `
User Profile:
Name: ${profile.name}
Course: ${profile.course}
GPA: ${profile.gpa}
Location: ${profile.location}
Preferred Fields: ${profile.preferred_fields}

Scholarships:
${scholarshipList}

User asked: "${question}"

You are a helpful scholarship chatbot. Answer the user's question based on their profile and the scholarships. Recommend only 3–5 if they ask for suggestions.
`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a scholarship advisor chatbot.' },
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
    console.error('Scholarship chatbot error:', error.message);
    return 'Sorry, I couldn’t process your request right now.';
  }
};

module.exports = {
  generateSummary,
  getAIEligibilityCheck,
  matchScholarshipsAI,
  chatScholarshipAdvisor
};
