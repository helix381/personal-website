import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-950">
          返回首页
        </Link>
        <h1 className="mt-12 text-4xl font-semibold tracking-normal">联系方式</h1>
        <p className="mt-4 text-slate-600">占位页，后续补充邮箱、微信或其他联系方式。</p>
      </div>
    </main>
  );
}
