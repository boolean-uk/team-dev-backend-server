-- Transfer data into the LikePost Table
INSERT INTO "prisma"."LikePost" ("userId", "postId", "createdAt")
    SELECT "userId", "postId", "createdAt" FROM "prisma"."Like"
    WHERE "postId" IS NOT NULL
    ON CONFLICT DO NOTHING;

-- Transfer data into the LikeComment Table
INSERT INTO "prisma"."LikeComment" ("userId", "commentId", "createdAt")
    SELECT "userId", "commentId", "createdAt" FROM "prisma"."Like"
    WHERE "commentId" IS NOT NULL
    ON CONFLICT DO NOTHING;