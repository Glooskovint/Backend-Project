-- CreateTable
CREATE TABLE "Usuario" (
    "firebase_uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("firebase_uid")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "objetivo_general" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiembroProyecto" (
    "usuarioId" TEXT NOT NULL,
    "proyectoId" INTEGER NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "MiembroProyecto_pkey" PRIMARY KEY ("usuarioId","proyectoId")
);

-- CreateTable
CREATE TABLE "ObjetivoEspecifico" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "proyectoId" INTEGER NOT NULL,

    CONSTRAINT "ObjetivoEspecifico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "presupuesto" DECIMAL(65,30) NOT NULL,
    "proyectoId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionTarea" (
    "tareaId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionTarea_pkey" PRIMARY KEY ("tareaId","usuarioId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Usuario"("firebase_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiembroProyecto" ADD CONSTRAINT "MiembroProyecto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("firebase_uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiembroProyecto" ADD CONSTRAINT "MiembroProyecto_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoEspecifico" ADD CONSTRAINT "ObjetivoEspecifico_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tarea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionTarea" ADD CONSTRAINT "AsignacionTarea_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionTarea" ADD CONSTRAINT "AsignacionTarea_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("firebase_uid") ON DELETE RESTRICT ON UPDATE CASCADE;