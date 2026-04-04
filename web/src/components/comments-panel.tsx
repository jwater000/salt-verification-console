import CommentsSection from "@/components/comments-section";

type CommentsPanelProps = {
  pagePath: string;
  heading?: string;
  description?: string;
};

export default function CommentsPanel(props: CommentsPanelProps) {
  return <CommentsSection {...props} />;
}
