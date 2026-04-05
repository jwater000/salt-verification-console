import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBoardPostBySlug, getCommunityRuntimeStatus } from "@/lib/community";
import CommentsPanel from "@/components/comments-panel";

type DiscussionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DiscussionDetailPage({ params }: DiscussionDetailPageProps) {
  const { slug } = await params;
  const runtime = getCommunityRuntimeStatus();
  const post = await getPublicBoardPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-emerald-500/20 bg-[linear-gradient(135deg,#081b16_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Discussion Detail</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          {post.authorLabel} · {post.boardKey} · {new Date(post.createdAt).toLocaleString()}
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          이 글은 짧은 댓글 하나로는 담기지 않는 질문과 반론, 독서 메모를 담기 위한 게시판 글이다.
          SALT를 읽는 과정에서 생긴 생각을 한 사람의 긴 호흡으로 따라가며 읽을 수 있다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            인증: {runtime.authConfigured ? "설정됨" : "미설정"}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            저장소: {runtime.databaseConfigured ? "Neon/Postgres" : "fallback/미연결"}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            공개 댓글 {post.commentCount}
          </span>
        </div>
        <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-200">
          {post.body}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <Link href="/discussion" className="text-sm text-slate-400 hover:text-white">
          ← 게시판 목록
        </Link>
      </div>

      <CommentsPanel
        pagePath={`/discussion/${post.slug}`}
        heading="이 게시글에 대한 댓글"
        description="게시글 본문에 대한 짧은 반응과 추가 질문을 이어서 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
