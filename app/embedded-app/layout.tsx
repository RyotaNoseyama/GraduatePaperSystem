export default function EmbeddedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="m-0 p-0">
        {/* ヘッダーやナビゲーションなしのシンプルなレイアウト */}
        {children}
      </body>
    </html>
  );
}
