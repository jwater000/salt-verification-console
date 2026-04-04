import CommentsSection from "@/components/comments-section";
import { getAppViewerSession } from "@/lib/auth/session";

type CommentsPanelProps = {
  pagePath: string;
  heading?: string;
  description?: string;
};

export default async function CommentsPanel(props: CommentsPanelProps) {
  const viewer = await getAppViewerSession();
  return <CommentsSection {...props} viewer={viewer} />;
}
