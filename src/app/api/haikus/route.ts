
import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    //findManyで俳句テーブルを取得する
    const haikus = await prisma.haiku.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    return NextResponse.json(haikus);
  } catch (error) {
    return NextResponse.json({ error: '俳句の取得に失敗しました' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    //haikuとnameをjson形式のリクエストで送信する
    const { name, haiku } = await request.json();
    //prismaクライアントで新しい俳句を作成
    const newHaiku = await prisma.haiku.create({
      data: {
        name,
        haiku,
      },
    });
    return NextResponse.json(newHaiku, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '俳句の投稿に失敗しました' }, { status: 500 });
  }
}
