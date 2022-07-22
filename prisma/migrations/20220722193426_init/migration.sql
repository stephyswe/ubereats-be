-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "isVegan" BOOLEAN,
    "address" TEXT,
    "ownerName" TEXT,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);
