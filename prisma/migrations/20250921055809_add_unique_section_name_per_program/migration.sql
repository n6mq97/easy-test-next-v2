/*
  Warnings:

  - A unique constraint covering the columns `[programId,name]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Section_programId_name_key" ON "Section"("programId", "name");
