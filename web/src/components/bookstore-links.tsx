const BOOKSTORES = [
  {
    name: "교보문고",
    href: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012691891",
    note: "전자책 상세 페이지",
  },
  {
    name: "알라딘",
    href: "https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=388309454&srsltid=AfmBOopJbZ0PU88ua_M4deOs5oed4Qh76t_r-Ooa3-rvXJhvxVa4wVAw",
    note: "도서 구매 페이지",
  },
  {
    name: "리디",
    href: "https://ridibooks.com/books/5273013694?srsltid=AfmBOory0SRaHFy9hO6Q4fyIkoNP44eOMbScTDbNJeWxxNNjR-iFLNsj",
    note: "전자책 상세 페이지",
  },
] as const;

type BookstoreLinksProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function BookstoreLinks({
  title = "구매 가능한 서점",
  description = "도서를 바로 찾으려는 경우 아래 서점 페이지를 참고할 수 있다.",
  compact = false,
}: BookstoreLinksProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
      <div className={`mt-5 grid gap-3 ${compact ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {BOOKSTORES.map((store) => (
          <a
            key={store.name}
            href={store.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600 hover:bg-slate-900/60"
          >
            <p className="text-sm font-semibold text-slate-100">{store.name}</p>
            <p className="mt-1 text-xs text-slate-500">{store.note}</p>
            <p className="mt-4 text-sm font-medium text-cyan-300">바로가기 ↗</p>
          </a>
        ))}
      </div>
    </div>
  );
}
