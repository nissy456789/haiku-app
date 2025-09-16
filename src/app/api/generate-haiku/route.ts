import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { theme } = await request.json();
//もしも入力した値が空だった場合400を返す
  if (!theme) {
    return NextResponse.json({ error: 'Theme is required' }, { status: 400 });
  }

  try {
    //直接APIを叩く
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      //AIに投げるプロンプト
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたは俳句を詠む名人です。テーマに沿った五七五の面白おかしい俳句を一句だけ生成してください。生成する俳句の形式は、「上の句 中の句 下の句」のように、半角スペースで区切ってください。',
          },
          {
            //ユーザーが入力した値
            role: 'user',
            content: `テーマ：「${theme}」`,
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return NextResponse.json({ error: 'Failed to generate haiku' }, { status: 500 });
    }

    const haiku = data.choices[0].message.content.trim();
    return NextResponse.json({ haiku });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
