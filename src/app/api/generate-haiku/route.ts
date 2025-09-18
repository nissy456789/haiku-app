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

    const prompt = `あなたは秋をテーマにした俳句を詠むお笑い芸人です。
五七五のリズムで、必ず一句だけ生成してください。
形式は「上の句 中の句 下の句」とし、半角スペースで区切ってください。
下の句には必ずオチやギャグ要素を入れてください。
解説や説明は書かず、俳句だけ出力してください。


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
