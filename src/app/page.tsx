'use client';

import { useState, useEffect } from 'react';

import { Haiku } from '@/types';

export default function Home() {
  const [haikus, setHaikus] = useState<Haiku[]>([]);
  const [name, setName] = useState('');
  const [haikuParts, setHaikuParts] = useState({ part1: '', part2: '', part3: '' });
  const [theme, setTheme] = useState('');
  //AIで俳句を生成していない時は、ローディングをしていないのでfalse
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHaikus = async () => {
      try {
        const res = await fetch('/api/haikus');
        if (!res.ok) throw new Error('俳句の取得に失敗しました。');
        const data = await res.json();
        setHaikus(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHaikus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { part1, part2, part3 } = haikuParts;
    const haiku = `${part1} ${part2} ${part3}`;

    if (!name.trim() || !part1.trim() || !part2.trim() || !part3.trim()) {
      alert('名前と俳句をすべて入力してください。');
      return;
    }

    try {
      const res = await fetch('/api/haikus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, haiku }),
      });

      if (res.ok) {
        const newHaiku = await res.json();
        setHaikus([newHaiku, ...haikus]);
        setName('');
        setHaikuParts({ part1: '', part2: '', part3: '' });
      } else {
        throw new Error('俳句の投稿に失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('俳句の投稿に失敗しました。');
    }
  };

  const handleHaikuChange = (e: React.ChangeEvent<HTMLInputElement>, part: 'part1' | 'part2' | 'part3') => {
    setHaikuParts({ ...haikuParts, [part]: e.target.value });
  };

  const handleGenerateHaiku = async () => {
    if (!theme.trim()) {
      alert('テーマを入力してください。');
      return;
    }
    setIsLoading(true);
    try {
      // AIに俳句を生成させる
      const res = await fetch('/api/generate-haiku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      if (!res.ok) {
        throw new Error('俳句の生成に失敗しました。');
      }

      const data = await res.json();
      const haiku = data.haiku;

      // 生成された俳句を空白文字（半角、全角など）で分割
      const parts = haiku.split(/\s+/);
      setHaikuParts({
        part1: parts[0] || '',
        part2: parts[1] || '',
        part3: parts[2] || '',
      });

      // お題入力欄のみクリア
      setTheme('');

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-yellow-50 min-h-screen font-serif">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-gray-800">俳句の秋</h1>
        <p className="text-gray-600">あなたの俳句を詠んでみよう</p>
      </header>

      <main className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
              お題
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black placeholder:text-black"
                placeholder="例: 猫, 宇宙"
              />
              <button
                type="button"
                onClick={handleGenerateHaiku}
                disabled={isLoading}
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 w-48"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  'AIに詠んでもらう'
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              詠み手
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black placeholder:text-black"
              placeholder="松尾芭蕉"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">俳句 (五・七・五)</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={haikuParts.part1}
                  onChange={(e) => handleHaikuChange(e, 'part1')}
                  maxLength={10}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black placeholder:text-black"
                  placeholder="上の句"
                  required
                />
                <p className="text-xs text-gray-500 text-right">{haikuParts.part1.length}/10</p>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={haikuParts.part2}
                  onChange={(e) => handleHaikuChange(e, 'part2')}
                  maxLength={10}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black placeholder:text-black"
                  placeholder="中の句"
                  required
                />
                <p className="text-xs text-gray-500 text-right">{haikuParts.part2.length}/10</p>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={haikuParts.part3}
                  onChange={(e) => handleHaikuChange(e, 'part3')}
                  maxLength={10}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-black placeholder:text-black"
                  placeholder="下の句"
                  required
                />
                <p className="text-xs text-gray-500 text-right">{haikuParts.part3.length}/10</p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            投稿する
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">みんなの俳句</h2>
          {haikus.length > 0 ? (
            <ul className="space-y-4">
              {haikus.map((haiku) => (
                <li key={haiku.id} className="p-4 bg-white rounded-lg shadow">
                  <p className="text-gray-800 whitespace-pre-wrap text-lg">{haiku.haiku}</p>
                  <p className="text-sm text-gray-600 text-right mt-2">- {haiku.name}</p>
                  <p className="text-xs text-gray-400 text-right mt-1">{new Date(haiku.created_at).toLocaleString('ja-JP')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">まだ俳句がありません。一番乗りで詠んでみませんか？</p>
          )}
        </div>
      </main>

      <footer className="text-center mt-12 py-4">
          <p className="text-xs text-gray-500">© 2025 俳句の秋</p>
      </footer>
    </div>
  );
}