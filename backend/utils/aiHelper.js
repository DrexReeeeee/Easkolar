const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const extractScholarshipDetailsFromWebsite = async (websiteLink) => {
  try {
    const { data } = await axios.get(websiteLink, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
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

// Format the user's full profile for all AI prompts
const formatUserProfile = (profile) => `
User Profile:
Name: ${profile.full_name || profile.name}
Birthdate: ${profile.birth_date}
Gender: ${profile.gender}
Location: ${profile.address_region}, ${profile.address_province}, ${profile.address_city}
Contact: ${profile.contact_number}
Email: ${profile.email}
School: ${profile.school}
Course/Strand: ${profile.course} / ${profile.strand_or_course}
Year Level: ${profile.year_level}
GPA: ${profile.gpa}
Academic Awards: ${profile.academic_awards}
Parents’ Occupation: ${profile.parents_occupation}
Parents’ Education: ${profile.parents_education}
Household Income Range: ${profile.household_income_range}
Siblings in School: ${profile.siblings_in_school}
Preferred Fields: ${profile.preferred_fields}, ${profile.field_of_interest}
Leadership Experience: ${profile.leadership_experience}
Volunteer Work: ${profile.volunteer_work}
Special Skills: ${profile.special_skills}
Special Sector Membership: ${profile.special_sector_membership}
`;

const getAIEligibilityCheck = async (profile, scholarship) => {
  const prompt = `
${formatUserProfile(profile)}

Scholarship:
Name: ${scholarship.name}
Description: ${scholarship.description}
Eligibility: ${scholarship.eligibility}

Question: Is this user eligible for this scholarship? Answer Yes or No and explain why in 1–2 sentences.
  `;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You determine if a student is eligible for a scholarship.' },
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
  const prompt = `
${formatUserProfile(profile)}

Here are a list of scholarships (with name, description, and eligibility):
${scholarships.map(s => `- ${s.name}: ${s.description}. Eligibility: ${s.eligibility}`).join('\n')}

Based on the profile, rank the top 3–5 most relevant scholarships and explain briefly why each one fits.
`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You rank scholarships based on user background and preferences.' },
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
You are a helpful scholarship advisor chatbot.

Here is the user's background and preferences:
${formatUserProfile(profile)}

Here is a list of available scholarships with their descriptions and eligibility:
${scholarshipList}

The user asked: "${question}"

Please respond in a friendly, informative way. Based on the question:
- If they are asking for recommendations, suggest 3–5 relevant scholarships.
- If they are asking general questions like "How much is the tuition?", "When is the deadline?", or "What documents are needed?", do your best to answer using the available scholarship information.
- If the information is missing or unclear, politely say so.
- You may also explain application procedures, deadlines, or answer eligibility-related questions.
- HOWEVER, if the question is unrelated to scholarships (e.g., about love, cooking, entertainment, general trivia, or anything off-topic), do **not answer**. Instead, reply politely with:  
  "I'm here to help with scholarships and student opportunities. Please ask me something related to that!"

Respond in complete sentences, using bullet points or paragraphs when helpful.
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
