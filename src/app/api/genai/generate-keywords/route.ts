import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash-lite',
  maxOutputTokens: 500,
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      { status: 405, headers: { Allow: 'POST' } }
    );
  }

  try {
    // Parse the request body
    const { title, category, name } = await req.json();

    // Validate input
    if (!title || !category || !name) {
      return NextResponse.json(
        { error: 'Missing required parameters (title, category, name).' },
        { status: 400 }
      );
    }

    // Create the prompt for keyword generation
    const prompt = `Generate 8 relevant keywords for a marketplace product with the following details and add the category as well:
    Title: ${title}
    Category: ${category}
    Product Name: ${name}

    Return only a comma-separated list of keywords, with no additional text, explanations, or labels.`;

    // Invoke the model
    const response = await model.invoke(prompt);

    // Extract and process keywords
    const responseText = response.content;
    if (typeof responseText === 'string' && responseText) {
      const keywords = responseText
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);
      return NextResponse.json({ keywords }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Failed to generate keywords.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating keywords:', error);
    return NextResponse.json(
      { error: 'Error generating keywords: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
