import "./globals.css";

export const metadata = {
  title: "胡益珲 | AI PM",
  description: "胡益珲的个人求职站，目标岗位 AI PM"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
