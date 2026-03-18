import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// llama-3.3-70b is fast and more than capable for recommendations
const MODEL = process.env.GROQ_MODEL;

export async function ask(prompt) {
    const res = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });
    return res.choices[0]?.message?.content ?? '';
}

export default groq;