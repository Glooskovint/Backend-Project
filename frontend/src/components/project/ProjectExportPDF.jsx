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
      }, 2000); // Aumentar el tiempo si las gráficas son complejas

      return () => clearTimeout(timer);
    }
  }, [project]);

  const captureChartAsImage = async (element, scale = 2) => {
    if (!element) return null;
    // Asegurarse de que el elemento es visible para html2canvas
    const originalStyles = {
      display: element.style.display,
      position: element.style.position,
      left: element.style.left,
      top: element.style.top,
      zIndex: element.style.zIndex,
    };
    element.style.display = "block"; // O 'inline-block', etc., según el layout
    element.style.position = "absolute"; // Posicionar temporalmente para captura
    element.style.left = "-9999px"; // Mover fuera de la pantalla
    element.style.top = "-9999px";
    element.style.zIndex = "10000"; // Asegurar que esté por encima de otros elementos

    try {
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false, // Desactivar logging en producción
        backgroundColor: null, // Para transparencia si es necesario, o color de fondo
        // width: element.scrollWidth, // Usar scrollWidth/Height para capturar todo el contenido
        // height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");

      // Restaurar estilos originales
      element.style.display = originalStyles.display;
      element.style.position = originalStyles.position;
      element.style.left = originalStyles.left;
      element.style.top = originalStyles.top;
      element.style.zIndex = originalStyles.zIndex;

      return imgData;
    } catch (error) {
      console.error("Error capturing chart as image:", error);
      // Restaurar estilos originales en caso de error
      element.style.display = originalStyles.display;
      element.style.position = originalStyles.position;
      element.style.left = originalStyles.left;
      element.style.top = originalStyles.top;
      element.style.zIndex = originalStyles.zIndex;
      return null;
    }
  };

  const exportPDF = async () => {
    const input = pdfContentRef.current; // Usar la referencia
    if (!input) {
      console.error("Element for PDF content not found.");
      if (onExportFinish) onExportFinish(false);
      return;
    }

    // 1. Capturar EDT como imagen
    const edtImage = await captureChartAsImage(
      document.getElementById("edt-chart-render-area-pdf")
    );
    if (edtImage) {
      const edtImgElement = document.getElementById(
        "edt-chart-img-placeholder"
      );
      if (edtImgElement) {
        edtImgElement.src = edtImage;
        edtImgElement.style.display = "block";
        const edtPlaceholderText = document.getElementById(
          "edt-placeholder-text"
        );
        if (edtPlaceholderText) edtPlaceholderText.style.display = "none";
      }
    }

    // 2. Capturar Gantt como imagen
    const ganttImage = await captureChartAsImage(
      document.getElementById("gantt-chart-render-area-pdf")
    );
    if (ganttImage) {
      const ganttImgElement = document.getElementById(
        "gantt-chart-img-placeholder"
      );
      if (ganttImgElement) {
        ganttImgElement.src = ganttImage;
        ganttImgElement.style.display = "block";
        const ganttPlaceholderText = document.getElementById(
          "gantt-placeholder-text"
        );
        if (ganttPlaceholderText) ganttPlaceholderText.style.display = "none";
      }
    }

    // 3. Capturar Presupuesto como imagen
    const presupuestoImage = await captureChartAsImage(
      document.getElementById("presupuesto-chart-render-area-pdf")
    );
    if (presupuestoImage) {
      const presupuestoImgElement = document.getElementById(
        "presupuesto-chart-img-placeholder"
      );
      if (presupuestoImgElement) {
        presupuestoImgElement.src = presupuestoImage;
        presupuestoImgElement.style.display = "block";
        const presupuestoPlaceholderText = document.getElementById(
          "presupuesto-placeholder-text"
        );
        if (presupuestoPlaceholderText)
          presupuestoPlaceholderText.style.display = "none";
      }
    }

    // Guardar referencia a los estilos originales para restaurarlos después de html2canvas
    const originalDisplay = input.style.display;
    const originalVisibility = input.style.visibility;

    // Hacer el contenido visible temporalmente para html2canvas
    input.style.display = "block";
    input.style.visibility = "visible";
    // Asegurar que esté posicionado de manera que html2canvas pueda "verlo" correctamente.
    // A veces, posicionarlo absolutamente fuera de la pantalla funciona mejor.
    input.style.position = "absolute";
    input.style.left = "-9999px"; // Mover fuera de la pantalla para evitar parpadeo
    input.style.top = "0px";

    html2canvas(input, {
      scale: 1.5, // Escala ajustada para mejor rendimiento y tamaño de archivo
      useCORS: true,
      logging: false, // Desactivar en producción
      windowWidth: input.scrollWidth, // Capturar todo el ancho
      windowHeight: input.scrollHeight, // Capturar toda la altura
      // Ignorar los contenedores de renderizado de gráficas originales
      ignoreElements: (element) => {
        return (
          element.id === "edt-chart-render-area-pdf" ||
          element.id === "gantt-chart-render-area-pdf" ||
          element.id === "presupuesto-chart-render-area-pdf"
        );
      },
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 0.9); // Calidad JPEG para reducir tamaño si es PNG grande
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth;
        const imgHeight = imgWidth / ratio;

        let position = 0;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // Or position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`proyecto-${project.titulo.replace(/\s+/g, "_")}.pdf`);

        // Restaurar estilos originales del contenedor principal
        input.style.display = originalDisplay;
        input.style.visibility = originalVisibility;
        input.style.position = "static"; // O el valor original
        input.style.left = "auto";
        input.style.top = "auto";

        if (onExportFinish) onExportFinish(true);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        // Restaurar estilos originales del contenedor principal en caso de error
        input.style.display = originalDisplay;
        input.style.visibility = originalVisibility;
        input.style.position = "static";
        input.style.left = "auto";
        input.style.top = "auto";

        if (onExportFinish) onExportFinish(false);
      });
  };

  // El useEffect ya llama a exportPDF.
  // Este componente está diseñado para ser "invisible" y auto-ejecutable.

  return (
    // Contenedor principal para el contenido del PDF. Permanece fuera de la pantalla.
    <div
      id="pdf-export-container"
      ref={pdfContentRef}
      style={{
        position: "absolute",
        left: "-9999px", // Técnica robusta para ocultar sin afectar el renderizado.
        top: "0px",
        width: "8.5in", // Ancho estándar de página (Letter).
        backgroundColor: "#fff",
        fontFamily: "'Times New Roman', Times, serif", // Fuente formal por defecto.
        color: "#000", // Texto en negro puro.
        zIndex: -10, // Aseguramos que esté por detrás de todo.
      }}
    >
      {/* Área de renderizado para gráficas. No interfiere con el layout. */}
      <div
        id="charts-render-area"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          zIndex: -11,
        }}
      >
        <div ref={edtContainerRef}>
          {project?.id && <EDT projectId={project.id} isExportMode={true} />}
        </div>
        <div
          ref={ganttContainerRef}
          style={{ width: "1000px", height: "600px" }}
        >
          {project?.id && <Gantt projectId={project.id} isExportMode={true} />}
        </div>
        <div ref={presupuestoContainerRef}>
          {project?.id && (
            <Presupuesto projectId={project.id} isExportMode={true} />
          )}
        </div>
      </div>

      {/* Contenido real del PDF. Aquí se definen los márgenes de la "página". */}
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
