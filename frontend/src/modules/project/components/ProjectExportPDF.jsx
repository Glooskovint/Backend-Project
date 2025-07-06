import React, { useEffect, useRef } from "react"; // Importar useEffect y useRef
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Importar los componentes de las gráficas
import EDT from "./EDT";
import Gantt from "./Gantt";
import Presupuesto from "./Presupuesto";

const ProjectExportPDF = ({ project, onExportFinish }) => {
  const pdfContentRef = useRef(null); // Usar useRef para el contenedor principal del PDF
  const edtContainerRef = useRef(null); // Ref para el contenedor de EDT
  const ganttContainerRef = useRef(null); // Ref para el contenedor de Gantt
  const presupuestoContainerRef = useRef(null); // Ref para el contenedor de Presupuesto

  useEffect(() => {
    // Iniciar la exportación automáticamente cuando el componente se monta
    // y los datos del proyecto están disponibles.
    if (project && project.id) {
      // Se necesita un pequeño retraso para asegurar que los componentes de las gráficas
      // se hayan renderizado completamente antes de intentar capturarlos.
      // Esto es especialmente importante si las gráficas tienen animaciones o carga asíncrona.
      const timer = setTimeout(() => {
        exportPDF();
      }, 10000); // Increased timeout to 10000ms for more complex charts, especially Gantt

      return () => clearTimeout(timer);
    }
  }, [project]);

  const captureChartAsImage = async (elementId, scale = 2) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(
        `[ProjectExportPDF] Element with ID '${elementId}' not found for capture.`
      );
      return null;
    }
    // Logging element visibility based on offsetWidth/Height can be misleading if parent is display:none
    // but html2canvas might still work if the element itself has dimensions.
    console.log(
      `[ProjectExportPDF] Attempting to capture element '${elementId}'.`
    );

    try {
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      console.log(
        `[ProjectExportPDF] Successfully captured '${elementId}'. Image data length: ${imgData.length}`
      );
      return imgData;
    } catch (error) {
      console.error(
        `[ProjectExportPDF] Error capturing chart '${elementId}' as image:`,
        error
      );
      return null;
    }
  };

  const exportPDF = async () => {
    const input = pdfContentRef.current;
    if (!input) {
      console.error("[ProjectExportPDF] PDF content container not found.");
      onExportFinish?.(false);
      return;
    }

    console.log("[ProjectExportPDF] Starting PDF export process.");

    const charts = [
      {
        id: "edt-chart-render-area-pdf",
        imgId: "edt-chart-img-placeholder",
        placeholderId: "edt-placeholder-text",
      },
      {
        id: "gantt-chart-render-area-pdf",
        imgId: "gantt-chart-img-placeholder",
        placeholderId: "gantt-placeholder-text",
      },
      {
        id: "presupuesto-chart-render-area-pdf",
        imgId: "presupuesto-chart-img-placeholder",
        placeholderId: "presupuesto-placeholder-text",
      },
    ];

    for (const chart of charts) {
      const image = await captureChartAsImage(chart.id);
      if (image) {
        const imgElement = document.getElementById(chart.imgId);
        if (imgElement) {
          imgElement.src = image;
          imgElement.style.display = "block";
          const placeholder = document.getElementById(chart.placeholderId);
          if (placeholder) placeholder.style.display = "none";
          console.log(`[ProjectExportPDF] ${chart.id} image updated.`);
        }
      } else {
        console.warn(`[ProjectExportPDF] Failed to capture ${chart.id}.`);
      }
    }

    // Captura principal del documento para PDF
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: true,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
      ignoreElements: (element) => element.id === "charts-render-area",
    });

    const imgHeightPx = canvas.height;
    const imgWidthPx = canvas.width;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pageHeightPx = (pdfHeight * imgWidthPx) / pdfWidth;
    const totalPages = Math.ceil(imgHeightPx / pageHeightPx);

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgWidthPx;
      sliceCanvas.height = Math.min(
        pageHeightPx,
        imgHeightPx - i * pageHeightPx
      );

      const sliceCtx = sliceCanvas.getContext("2d");
      sliceCtx?.drawImage(
        canvas,
        0,
        i * pageHeightPx,
        imgWidthPx,
        sliceCanvas.height,
        0,
        0,
        imgWidthPx,
        sliceCanvas.height
      );

      // VALIDACIÓN: evitar agregar páginas completamente blancas
      const imageData = sliceCtx?.getImageData(
        0,
        0,
        sliceCanvas.width,
        sliceCanvas.height
      );
      const pixels = imageData?.data;
      const hasVisibleContent = pixels?.some((value, index) => {
        const channel = index % 4;
        return channel !== 3 && value < 250; // R, G, B canales con algo que no sea blanco puro
      });

      if (hasVisibleContent) {
        const sliceImgData = sliceCanvas.toDataURL("image/png", 1.0);
        const sliceHeightPt = (sliceCanvas.height * pdfWidth) / imgWidthPx;
        pdf.addImage(sliceImgData, "PNG", 0, 0, pdfWidth, sliceHeightPt);
      } else {
        console.log(`[ProjectExportPDF] Página ${i + 1} omitida (vacía)`);
      }
    }

    pdf.save(`proyecto-${project.titulo.replace(/\s+/g, "_")}.pdf`);
    console.log("[ProjectExportPDF] PDF exportado con éxito.");
    onExportFinish?.(true);
  };

  return (
    <div
      id="pdf-export-container"
      ref={pdfContentRef}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0px", // Keep at top for consistency if temporarily made visible for debug
        width: "8.5in", // Standard Letter width, content inside will be structured by 'pdf-content-proper'
        backgroundColor: "#fff",
        fontFamily: "'Times New Roman', Times, serif",
        color: "#000",
        zIndex: -10,
      }}
    >
      {/* This area is for rendering chart components in isExportMode=true so they can be captured by ID.
           It's positioned off-screen. The captured images are then placed into 'pdf-content-proper'. */}
      <div
        id="charts-render-area"
        style={{
          position: "absolute",
          left: "0px", // Relative to parent pdf-export-container, helps if debugging visibility
          top: "-9999px", // Effectively off-screen
          zIndex: -11, // Behind everything
        }}
      >
        <div ref={edtContainerRef}>
          {project?.id && <EDT projectId={project.id} isExportMode={true} />}
        </div>
        {/* Gantt and Presupuesto containers no longer need fixed dimensions here; components manage their own size for export */}
        <div ref={ganttContainerRef}>
          {project?.id && (
            <Gantt
              projectId={project.id}
              isExportMode={true}
              exportMaxDepth={1}
            />
          )}
        </div>
        <div ref={presupuestoContainerRef}>
          {project?.id && (
            <Presupuesto projectId={project.id} isExportMode={true} />
          )}
        </div>
      </div>

      {/* This is the actual content that will be rendered into the PDF pages.
           It includes text, and placeholders for chart images. */}
      <div
        id="pdf-content-proper"
        style={{ padding: "1in" /* Márgenes estándar de 1 pulgada */ }}
      >
        {/* Encabezado del Documento */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 15px 0",
            }}
          >
            Acta de Constitución del Proyecto
          </h1>
          <hr style={{ border: "none", borderBottom: "1px solid #000" }} />
        </div>

        {/* Título del Proyecto */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
            Título del Proyecto: {project.titulo || "No especificado"}
          </h2>
        </div>

        {/* Información General del Proyecto */}
        <div
          style={{ marginBottom: "40px", fontSize: "12pt", lineHeight: "1.5" }}
        >
          <p>
            <strong>Fecha de Preparación:</strong>{" "}
            {new Date().toLocaleDateString("es-ES")}
          </p>
          <p>
            <strong>Director del Proyecto:</strong>{" "}
            {project.owner?.nombre || "No especificado"}
          </p>
          <p>
            <strong>Patrocinador Principal:</strong>{" "}
            {"______________________________"}
          </p>
          <p>
            <strong>Fecha de Inicio Prevista:</strong>{" "}
            {project.fecha_inicio
              ? new Date(project.fecha_inicio).toLocaleDateString("es-ES")
              : "N/A"}
          </p>
          <p>
            <strong>Fecha de Fin Prevista:</strong>{" "}
            {project.fecha_fin
              ? new Date(project.fecha_fin).toLocaleDateString("es-ES")
              : "N/A"}
          </p>
        </div>

        {/* Secciones de Contenido */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "15px",
            }}
          >
            1. Descripción y Propósito del Proyecto
          </h3>
          <p style={{ fontSize: "12pt", lineHeight: "1.6" }}>
            {project.descripcion || "No hay descripción disponible."}
          </p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "15px",
            }}
          >
            2. Objetivo General del Proyecto
          </h3>
          <p style={{ fontSize: "12pt", lineHeight: "1.6" }}>
            {project.objetivo_general || "No definido."}
          </p>
        </div>

        {/* Conditional rendering for Specific Objectives */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "15px",
            }}
          >
            3. Objetivos Específicos y Criterios de Éxito
          </h3>
          {project.objectives && project.objectives.length > 0 ? (
            <ul
              style={{
                fontSize: "12pt",
                lineHeight: "1.6",
                paddingLeft: "30px",
                margin: "0",
              }}
            >
              {project.objectives.map((obj, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {obj.descripcion}{" "}
                  {/* Assuming 'descripcion' is the correct field */}
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                fontSize: "12pt",
                lineHeight: "1.6",
                fontStyle: "italic",
              }}
            >
              No hay objetivos específicos definidos para este proyecto.
            </p>
          )}
        </div>

        {/* Contenedor para EDT con Salto de Página */}
        {/* Remove the old block for objectives, it's replaced above
        {project.objectives && project.objectives.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "14pt",
                fontWeight: "bold",
                borderBottom: "1px solid #000",
                paddingBottom: "5px",
                marginBottom: "15px",
              }}
            >
              3. Objetivos Específicos y Criterios de Éxito
            </h3>
            <ul
              style={{
                fontSize: "12pt",
                lineHeight: "1.6",
                paddingLeft: "30px",
                margin: "0",
              }}
            >
              {project.objectives.map((obj, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {obj.descripcion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contenedor para EDT con Salto de Página */}
        <div
          style={{
            pageBreakBefore: "always",
            paddingTop: "1in" /* Margen superior en nueva página */,
          }}
        >
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "20px",
            }}
          >
            4. Estructura de Desglose de Tareas (EDT/WBS)
          </h3>
          <div
            id="edt-chart-container-pdf"
            style={{
              pageBreakInside: "avoid",
              padding: "10px",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
            }}
          >
            <p id="edt-placeholder-text">Generando EDT...</p>
            <img
              id="edt-chart-img-placeholder"
              style={{ display: "none", maxWidth: "100%", height: "auto" }}
              alt="Gráfico EDT"
            />
          </div>
        </div>

        {/* Contenedor para Gantt con Salto de Página */}
        <div style={{ pageBreakBefore: "always", paddingTop: "1in" }}>
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "20px",
            }}
          >
            5. Cronograma de Hitos Principales (Diagrama de Gantt)
          </h3>
          <div
            id="gantt-chart-container-pdf"
            style={{
              pageBreakInside: "avoid",
              padding: "10px",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
            }}
          >
            <p id="gantt-placeholder-text">Generando Diagrama de Gantt...</p>
            <img
              id="gantt-chart-img-placeholder"
              style={{ display: "none", maxWidth: "100%", height: "auto" }}
              alt="Diagrama de Gantt"
            />
          </div>
        </div>

        {/* Contenedor para Presupuesto con Salto de Página */}
        <div style={{ pageBreakBefore: "always", paddingTop: "1in" }}>
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "20px",
            }}
          >
            6. Resumen del Presupuesto del Proyecto
          </h3>
          <div
            id="budget-matrix-container-pdf"
            style={{
              pageBreakInside: "avoid",
              padding: "10px",
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
            }}
          >
            <p id="presupuesto-placeholder-text">
              Generando Matriz de Presupuesto...
            </p>
            <img
              id="presupuesto-chart-img-placeholder"
              style={{ display: "none", maxWidth: "100%", height: "auto" }}
              alt="Matriz de Presupuesto"
            />
          </div>
        </div>

        {/* Sección de Aprobaciones con Salto de Página */}
        <div style={{ pageBreakBefore: "always", paddingTop: "3.5in" }}>
          <h3
            style={{
              fontSize: "14pt",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginBottom: "100px", // Espacio para firmas
            }}
          >
            7. Aprobaciones
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12pt",
            }}
          >
            <div style={{ width: "45%", textAlign: "center" }}>
              <p>_________________________</p>
              <p>{project.owner?.nombre || "Director del Proyecto"}</p>
              <p>Fecha: ___ / ___ / ______</p>
            </div>
            <div style={{ width: "45%", textAlign: "center" }}>
              <p>_________________________</p>
              <p>Patrocinador del Proyecto (Sponsor)</p>
              <p>Fecha: ___ / ___ / ______</p>
            </div>
          </div>

          {/* Footer del Documento relativo (flujo normal) */}
          <div
            style={{
              marginTop: "15px", // Espacio visual debajo de las firmas
              textAlign: "center",
              fontSize: "10pt",
              color: "#666",
            }}
          >
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #ccc",
                marginBottom: "10px",
                marginTop: "40px",
              }}
            />
            <p>Documento generado el {new Date().toLocaleDateString()}</p>
            <p>
              Confidencialidad: Este documento es para uso interno y de los
              stakeholders del proyecto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectExportPDF;
