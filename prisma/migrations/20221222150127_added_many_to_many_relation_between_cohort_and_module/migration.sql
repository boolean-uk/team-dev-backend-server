-- CreateTable
CREATE TABLE "_CohortToModule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CohortToModule_AB_unique" ON "_CohortToModule"("A", "B");

-- CreateIndex
CREATE INDEX "_CohortToModule_B_index" ON "_CohortToModule"("B");

-- AddForeignKey
ALTER TABLE "_CohortToModule" ADD CONSTRAINT "_CohortToModule_A_fkey" FOREIGN KEY ("A") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CohortToModule" ADD CONSTRAINT "_CohortToModule_B_fkey" FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
