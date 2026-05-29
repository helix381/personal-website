import Link from "next/link";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "项目" },
  { href: "/contact", label: "联系方式" }
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 text-slate-900">
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-b border-slate-300 pb-5">
        <Link href="/" className="text-base font-semibold">
          胡益珲
        </Link>
        <div className="flex gap-5 text-sm text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="mx-auto grid max-w-5xl gap-10 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            AI Product Manager
          </p>
          <h1 className="text-5xl font-semibold leading-tight tracking-normal text-slate-950 md:text-7xl">
            胡益珲
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700">
            面向 AI PM 岗位，连接产品判断、用户洞察与技术落地。
          </p>
        </div>

        <div className="border-l-4 border-emerald-700 bg-white/60 p-6 text-base leading-7 text-slate-700">
          <p>个人求职站最小版本。</p>
          <p className="mt-3">后续按页面逐步补充 About、项目与联系方式。</p>
        </div>
      </section>
    </main>
  );
}
