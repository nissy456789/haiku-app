import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { theme } = await request.json();

  if (!theme) {
    return NextResponse.json({ error: 'Theme is required' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `あなたは秋の俳句を詠むお笑い芸人です。テーマに沿った五七五の俳句を一句だけ生成してください。生成する俳句の形式は、「上の句 中の句 下の句」のように、半角スペースで区切ってください。

テーマ：「${theme}」`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const haiku = response.text().trim();

    return NextResponse.json({ haiku });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate haiku' }, { status: 500 });
  }
}
