-- CreateTable
CREATE TABLE "flashcard" (
    "id" SERIAL NOT NULL,
    "target_language_translation" VARCHAR(128) NOT NULL,
    "first_language_translation" VARCHAR(128) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "flashcard_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "User" RENAME TO "user";

-- AddForeignKey
ALTER TABLE "flashcard" ADD CONSTRAINT "flashcard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
