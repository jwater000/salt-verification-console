-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'restricted', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "public"."UserRoleName" AS ENUM ('member', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "public"."ContentStatus" AS ENUM ('published', 'hidden', 'deleted');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('public', 'members_only');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('open', 'reviewing', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "public"."ReportReasonCode" AS ENUM ('spam', 'abuse', 'privacy', 'impersonation', 'other');

-- CreateEnum
CREATE TYPE "public"."ModerationTargetType" AS ENUM ('board_post', 'post_comment', 'user_role', 'user_status');

-- CreateEnum
CREATE TYPE "public"."ModerationActionType" AS ENUM ('hide', 'restore', 'soft_delete', 'restrict_user', 'suspend_user', 'reinstate_user', 'grant_role', 'revoke_role');

-- CreateEnum
CREATE TYPE "public"."ActivityEventType" AS ENUM ('user_created', 'login_completed', 'post_created', 'post_updated', 'post_deleted', 'comment_created', 'comment_updated', 'comment_deleted', 'report_created', 'moderation_action');

-- CreateEnum
CREATE TYPE "public"."ActivityTargetType" AS ENUM ('user', 'board_post', 'post_comment', 'report', 'moderation_action');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_subject" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "primary_provider" TEXT,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role" "public"."UserRoleName" NOT NULL,
    "granted_by" UUID,
    "granted_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."board_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'published',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',
    "board_key" TEXT NOT NULL DEFAULT 'general',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "board_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID,
    "page_path" TEXT,
    "parent_comment_id" UUID,
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reporter_id" UUID NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" UUID NOT NULL,
    "reason_code" "public"."ReportReasonCode" NOT NULL,
    "reason_detail" TEXT,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ(6),
    "reviewed_by" UUID,

    CONSTRAINT "content_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."moderation_actions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID NOT NULL,
    "target_type" "public"."ModerationTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "action_type" "public"."ModerationActionType" NOT NULL,
    "reason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "event_type" "public"."ActivityEventType" NOT NULL,
    "target_type" "public"."ActivityTargetType",
    "target_id" UUID,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_subject_key" ON "public"."users"("auth_subject");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_key" ON "public"."user_roles"("user_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "board_posts_slug_key" ON "public"."board_posts"("slug");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."board_posts" ADD CONSTRAINT "board_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_comments" ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."board_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_comments" ADD CONSTRAINT "post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_comments" ADD CONSTRAINT "post_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."post_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_reports" ADD CONSTRAINT "content_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_reports" ADD CONSTRAINT "content_reports_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."moderation_actions" ADD CONSTRAINT "moderation_actions_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_log" ADD CONSTRAINT "activity_log_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
