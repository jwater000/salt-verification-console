import CommentsSection from "@/components/comments-section";
import { getCommunityRuntimeStatus } from "@/lib/community";

type CommentsPanelProps = {
  pagePath: string;
  heading?: string;
  description?: string;
};

export default function CommentsPanel(props: CommentsPanelProps) {
  const runtime = getCommunityRuntimeStatus();
  return <CommentsSection {...props} runtime={runtime} />;
}
