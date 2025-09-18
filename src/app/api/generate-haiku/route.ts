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

    const prompt = `あなたは秋の俳句を作るシュール系コント芸人です。五七五のリズムで一句だけ作ってください。最後に必ず爆笑を狙うオチを入れてください。形式は「上の句 中の句 下の句」で、半角スペースで区切ってください。

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
