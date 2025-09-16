-- CreateTable
CREATE TABLE "public"."Haiku" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "haiku" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Haiku_pkey" PRIMARY KEY ("id")
);
