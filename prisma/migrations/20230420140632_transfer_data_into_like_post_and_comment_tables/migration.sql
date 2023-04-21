-- Transfer data into the LikePost Table
INSERT INTO "LikePost" ("userId", "postId", "createdAt")
    SELECT "userId", "postId", "createdAt" FROM "Like"
    WHERE "postId" IS NOT NULL
    ON CONFLICT DO NOTHING;

-- Transfer data into the LikeComment Table
INSERT INTO "LikeComment" ("userId", "commentId", "createdAt")
    SELECT "userId", "commentId", "createdAt" FROM "Like"
    WHERE "commentId" IS NOT NULL
    ON CONFLICT DO NOTHING;