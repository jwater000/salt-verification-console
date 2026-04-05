import Link from "next/link";
import { getCommunityRuntimeStatus, listPublicBoardPosts } from "@/lib/community";
import DiscussionCompose from "@/components/discussion-compose";

export default async function DiscussionPage() {
  const runtime = getCommunityRuntimeStatus();
  const posts = await listPublicBoardPosts();

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-emerald-500/20 bg-[linear-gradient(135deg,#081b16_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Discussion</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          SALT를 읽다 생긴 질문과 해석을
          <br />
          함께 쌓아 두는 공개 공간
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          어떤 사람은 수식을 보고 질문이 생기고, 어떤 사람은 한 문장을 읽고 해석을 남기고 싶어진다.
          이곳은 그런 흔적을 모으는 공간이다. 짧은 댓글보다 긴 질문, 독서 메모, 반론과 보충 설명을
          한자리에 모아 SALT를 더 입체적으로 읽게 만든다.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-500">인증</p>
            <p className="mt-1 text-sm text-slate-200">
              {runtime.authConfigured ? "OAuth 로그인 설정됨" : "OAuth 로그인 미설정"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-500">저장소</p>
            <p className="mt-1 text-sm text-slate-200">
              {runtime.databaseConfigured ? "Neon/Postgres 연결 모드" : "로컬 fallback 저장 모드"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-xs text-slate-500">공개 게시글</p>
            <p className="mt-1 text-sm text-slate-200">{posts.length} items</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <h2 className="text-sm font-semibold text-white">이 공간에서 기대할 수 있는 것</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            페이지를 읽으며 막히는 지점, 더 설명이 필요해 보이는 대목, 스스로 떠오른 해석을 길게 남길 수 있다.
          </p>
          <p>
            댓글보다 긴 문장과 공개적인 질문을 모아 두기 때문에, 한 사람이 던진 물음이 다른 독자의 출발점이 되기도 한다.
          </p>
        </div>
      </div>

      <DiscussionCompose runtime={runtime} />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">공개 게시글</h2>
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            소개로 돌아가기 →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
            아직 공개 게시글이 없습니다. 현재 환경에서는
            {runtime.databaseConfigured
              ? " `board_posts`에 게시글이 없거나 마이그레이션 이후 데이터가 들어오지 않은 상태입니다."
              : " fallback 저장소에는 아직 첫 게시글이 올라오지 않았습니다."}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      href={`/discussion/${post.slug}`}
                      className="text-lg font-semibold text-white hover:text-emerald-300"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {post.authorLabel} · {post.boardKey} · {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                    댓글 {post.commentCount}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {post.body}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/discussion/${post.slug}`}
                    className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    글 상세와 댓글 보기 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
