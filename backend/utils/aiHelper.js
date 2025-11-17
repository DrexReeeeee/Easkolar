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

  const formatUserProfileHTML = (profile) => `
    <strong>Name:</strong> ${profile.full_name || profile.name}<br>
    <strong>Birthdate:</strong> ${profile.birth_date}<br>
    <strong>Gender:</strong> ${profile.gender}<br>
    <strong>Location:</strong> ${profile.address_region}, ${profile.address_province}, ${profile.address_city}<br>
    <strong>Contact:</strong> ${profile.contact_number}<br>
    <strong>Email:</strong> ${profile.email}<br>
    <strong>School:</strong> ${profile.school}<br>
    <strong>Course/Strand:</strong> ${profile.course} / ${profile.strand_or_course}<br>
    <strong>Year Level:</strong> ${profile.year_level}<br>
    <strong>GPA:</strong> ${profile.gpa}<br>
    <strong>Academic Awards:</strong> ${profile.academic_awards}<br>
    <strong>Parents’ Occupation:</strong> ${profile.parents_occupation}<br>
    <strong>Parents’ Education:</strong> ${profile.parents_education}<br>
    <strong>Household Income Range:</strong> ${profile.household_income_range}<br>
    <strong>Siblings in School:</strong> ${profile.siblings_in_school}<br>
    <strong>Preferred Fields:</strong> ${profile.preferred_fields}, ${profile.field_of_interest}<br>
    <strong>Leadership Experience:</strong> ${profile.leadership_experience}<br>
    <strong>Volunteer Work:</strong> ${profile.volunteer_work}<br>
    <strong>Special Skills:</strong> ${profile.special_skills}<br>
    <strong>Special Sector Membership:</strong> ${profile.special_sector_membership}<br>
  `;

  const scholarshipListHTML = scholarships.slice(0, 30).map(s => (
    `<li>
      <strong>${s.name}</strong><br>
      <strong>Description:</strong> ${s.description || 'N/A'}<br>
      <strong>Eligibility:</strong> ${s.eligibility || 'N/A'}<br>
      ${s.website_link ? `<strong>Website:</strong> <a href="${s.website_link}" target="_blank">${s.website_link}</a><br>` : ''}
    </li>`
  )).join('');

  const prompt = `
You are a scholarship advisor chatbot with a mission to provide **highly accurate and relevant scholarship suggestions** based on the user's profile.

User Profile:
<pre>${formatUserProfileHTML(profile)}</pre>

Available Scholarships:
<ul>
${scholarshipListHTML}
</ul>

User asked: "<strong>${question}</strong>"

Instructions for your response:
1. ONLY suggest scholarships that **truly match the user's profile and preferences**.
2. Suggest **3–5 scholarships maximum**, if applicable.
3. For each suggestion, include:
   - Name (bold)
   - Description
   - Eligibility criteria
   - Website link if available
4. Use **HTML formatting**: 
   - <strong> for bold text
   - <ul> and <li> for lists
   - double <br><br> for line breaks
5. If the user asks general questions (deadlines, documents, tuition), answer using available scholarship info in bullet points.
6. If information is missing or unclear, say politely that it is unavailable.
7. Do NOT answer unrelated questions (love, cooking, trivia, etc.). Respond politely:  
   "I'm here to help with scholarships and student opportunities. Please ask something related to that!"

Make sure suggestions are 100% relevant, accurate, and formatted clearly in HTML.
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
    return '<p>Sorry, I couldn’t process your request right now.</p>';
  }
};

module.exports = {
  generateSummary,
  getAIEligibilityCheck,
  matchScholarshipsAI,
  chatScholarshipAdvisor
};
