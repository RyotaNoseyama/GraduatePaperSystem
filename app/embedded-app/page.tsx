"use client";

import { useState, useEffect } from "react";

export default function EmbeddedAppPage() {
  const [scrollY, setScrollY] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      // 親ウィンドウにスクロール情報を送信
      window.parent.postMessage(
        {
          type: "SCROLL",
          scrollY: newScrollY,
          timestamp: Date.now(),
        },
        "*"
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (itemIndex: number) => {
    setClickCount((prev) => prev + 1);

    // 親ウィンドウにクリック情報を送信
    window.parent.postMessage(
      {
        type: "CLICK",
        itemIndex,
        clickCount: clickCount + 1,
        timestamp: Date.now(),
      },
      "*"
    );
  };

  return (
    <div className="min-h-[200vh] p-6 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-0 z-10 border-b-4 border-blue-500">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            インタラクティブWebアプリケーション
          </h1>
          <div className="flex gap-4 text-sm text-slate-600">
            <div>
              <span className="font-semibold">スクロール:</span> {scrollY}px
            </div>
            <div>
              <span className="font-semibold">クリック数:</span> {clickCount}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-purple-500 hover:border-pink-500"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                コンテンツアイテム {i + 1}
              </h3>
              <p className="text-slate-600">
                このアイテムをクリックすると、親ページにイベントが送信されます。
                スクロール位置も自動的に記録されています。
              </p>
              <div className="mt-3 flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Item #{i + 1}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  Interactive
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">最後までスクロールしました！</h2>
          <p className="text-blue-100">
            すべてのインタラクションが記録されています
          </p>
        </div>
      </div>
    </div>
  );
}
