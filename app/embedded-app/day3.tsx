"use client";

import { useState } from "react";
import { Save, Star } from "lucide-react";

type Post = {
  id: number;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
};

const initialPosts: Post[] = [
  {
    id: 2,
    author: "Jordan Wells",
    handle: "@jordanw",
    content:
      "Quarterly launch tomorrow. Schedule just leaked everywhere so I guess that's our announcement now.",
    timestamp: "5m",
  },
  {
    id: 1,
    author: "Studio Labs",
    handle: "@studiolabs",
    content: "Ship fast. Reflect later. #buildinpublic",
    timestamp: "28m",
  },
];

export default function Day3Page() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState("");

  const handlePublish = () => {
    if (!draft.trim()) {
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      handle: "@you",
      content: draft.trim(),
      timestamp: "Just now",
    };

    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
    alert("Post Published to Public Timeline successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
              <Star className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Compose
              </p>
              <h1 className="text-xl font-semibold">What's happening?</h1>
            </div>
          </header>

          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What's happening?"
            className="mt-6 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-800 outline-none focus:border-blue-500"
          />

          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Recent Posts
          </p>
          <div className="mt-4 space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{post.author}</span>
                  <span className="text-slate-500">{post.handle}</span>
                  <span className="text-slate-400">· {post.timestamp}</span>
                </div>
                <p className="text-base text-slate-800">{post.content}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
