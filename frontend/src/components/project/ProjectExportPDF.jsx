import React, { useEffect, useRef } from 'react'; // Importar useEffect y useRef
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Importar los componentes de las gráficas
import EDT from './EDT';
import Gantt from './Gantt';
import Presupuesto from './Presupuesto';


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
    element.style.display = 'block'; // O 'inline-block', etc., según el layout
    element.style.position = 'absolute'; // Posicionar temporalmente para captura
    element.style.left = '-9999px'; // Mover fuera de la pantalla
    element.style.top = '-9999px';
    element.style.zIndex = '10000'; // Asegurar que esté por encima de otros elementos


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
        const imgData = canvas.toDataURL('image/png');

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
    const edtImage = await captureChartAsImage(document.getElementById('edt-chart-render-area-pdf'));
    if (edtImage) {
        const edtImgElement = document.getElementById('edt-chart-img-placeholder');
        if (edtImgElement) {
            edtImgElement.src = edtImage;
            edtImgElement.style.display = 'block';
            const edtPlaceholderText = document.getElementById('edt-placeholder-text');
            if(edtPlaceholderText) edtPlaceholderText.style.display = 'none';
        }
    }

    // 2. Capturar Gantt como imagen
    const ganttImage = await captureChartAsImage(document.getElementById('gantt-chart-render-area-pdf'));
    if (ganttImage) {
        const ganttImgElement = document.getElementById('gantt-chart-img-placeholder');
        if (ganttImgElement) {
            ganttImgElement.src = ganttImage;
            ganttImgElement.style.display = 'block';
            const ganttPlaceholderText = document.getElementById('gantt-placeholder-text');
            if(ganttPlaceholderText) ganttPlaceholderText.style.display = 'none';
        }
    }

    // 3. Capturar Presupuesto como imagen
    const presupuestoImage = await captureChartAsImage(document.getElementById('presupuesto-chart-render-area-pdf'));
    if (presupuestoImage) {
        const presupuestoImgElement = document.getElementById('presupuesto-chart-img-placeholder');
        if (presupuestoImgElement) {
            presupuestoImgElement.src = presupuestoImage;
            presupuestoImgElement.style.display = 'block';
            const presupuestoPlaceholderText = document.getElementById('presupuesto-placeholder-text');
            if(presupuestoPlaceholderText) presupuestoPlaceholderText.style.display = 'none';
        }
    }


    // Guardar referencia a los estilos originales para restaurarlos después de html2canvas
    const originalDisplay = input.style.display;
    const originalVisibility = input.style.visibility;

    // Hacer el contenido visible temporalmente para html2canvas
    input.style.display = 'block';
    input.style.visibility = 'visible';
    // Asegurar que esté posicionado de manera que html2canvas pueda "verlo" correctamente.
    // A veces, posicionarlo absolutamente fuera de la pantalla funciona mejor.
    input.style.position = 'absolute';
    input.style.left = '-9999px'; // Mover fuera de la pantalla para evitar parpadeo
    input.style.top = '0px';


    html2canvas(input, {
      scale: 1.5, // Escala ajustada para mejor rendimiento y tamaño de archivo
      useCORS: true,
      logging: false, // Desactivar en producción
      windowWidth: input.scrollWidth, // Capturar todo el ancho
      windowHeight: input.scrollHeight, // Capturar toda la altura
      // Ignorar los contenedores de renderizado de gráficas originales
      ignoreElements: (element) => {
        return element.id === 'edt-chart-render-area-pdf' ||
               element.id === 'gantt-chart-render-area-pdf' ||
               element.id === 'presupuesto-chart-render-area-pdf';
      }
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 0.9); // Calidad JPEG para reducir tamaño si es PNG grande
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4'
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

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // Or position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`proyecto-${project.titulo.replace(/\s+/g, '_')}.pdf`);

        // Restaurar estilos originales del contenedor principal
        input.style.display = originalDisplay;
        input.style.visibility = originalVisibility;
        input.style.position = 'static'; // O el valor original
        input.style.left = 'auto';
        input.style.top = 'auto';


        if (onExportFinish) onExportFinish(true);
      })
      .catch(error => {
        console.error("Error generating PDF:", error);
        // Restaurar estilos originales del contenedor principal en caso de error
        input.style.display = originalDisplay;
        input.style.visibility = originalVisibility;
        input.style.position = 'static';
        input.style.left = 'auto';
        input.style.top = 'auto';

        if (onExportFinish) onExportFinish(false);
      });
  };

  // El useEffect ya llama a exportPDF.
  // Este componente está diseñado para ser "invisible" y auto-ejecutable.

  return (
    // Contenedor principal para el contenido del PDF. Se hace visible temporalmente durante la captura.
    // Aplicar display: 'none' o visibility: 'hidden' para ocultarlo inicialmente,
    // pero html2canvas necesita que sea 'block' o similar durante la captura.
    // El truco de posicionarlo fuera de la pantalla es mejor.
    <div
        id="pdf-export-container"
        ref={pdfContentRef}
        style={{
            position: 'absolute',
            left: '-9999px', // Inicialmente fuera de pantalla
            top: '0px',
            // visibility: 'hidden', // Otra opción si el posicionamiento absoluto no es ideal
            width: '800px', // Ancho fijo para consistencia del layout
            padding: '40px',
            backgroundColor: 'white', // Fondo blanco para el PDF
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            zIndex: -1 // Para que no interfiera con la UI principal
        }}
    >
        {/* Contenedores "invisibles" para renderizar las gráficas antes de capturarlas */}
        {/* Estos deben estar fuera del flujo normal o ser clonados correctamente por html2canvas */}
        <div id="charts-render-area" style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -2, width: '800px' /* o el tamaño que necesiten las gráficas */ }}>
            <div ref={edtContainerRef} id="edt-chart-render-area-pdf">
                {project && project.id && <EDT projectId={project.id} isExportMode={true} />}
            </div>
            <div ref={ganttContainerRef} id="gantt-chart-render-area-pdf" style={{width: '1000px', height:'600px' /* Ajustar según sea necesario */}}>
                {project && project.id && <Gantt projectId={project.id} isExportMode={true} />}
            </div>
            <div ref={presupuestoContainerRef} id="presupuesto-chart-render-area-pdf">
                {project && project.id && <Presupuesto projectId={project.id} isExportMode={true} />}
            </div>
        </div>

        {/* Contenido real del PDF */}
        <div id="pdf-content-proper">
            {/* Formal Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000' }}>Acta de Constitución del Proyecto</h1>
          <hr style={{ border: '1px solid #ccc', margin: '10px 0' }} />
        </div>

        {/* Project Title */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px' }}>
            Título del Proyecto: {project.titulo}
          </h2>
        </div>

        {/* Project Dates */}
        <div style={{ marginBottom: '20px', fontSize: '14px' }}>
          <p><strong>Fecha de Inicio:</strong> {project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Fecha de Fin:</strong> {project.fecha_fin ? new Date(project.fecha_fin).toLocaleDateString() : 'N/A'}</p>
        </div>

        {/* Project Manager / Owner */}
        <div style={{ marginBottom: '30px', fontSize: '14px' }}>
           {/* Assuming project.owner is an object with a name property */}
          <p><strong>Director/Gerente del Proyecto:</strong> {project.owner?.nombre || 'No especificado'}</p>
        </div>


        {/* Description */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>1. Descripción del Proyecto</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{project.descripcion || 'No hay descripción disponible.'}</p>
        </div>

        {/* General Objective */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>2. Objetivo General del Proyecto</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{project.objetivo_general || 'No definido.'}</p>
        </div>

        {/* Specific Objectives (Placeholder) */}
        {project.objectives && project.objectives.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>3. Objetivos Específicos</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
              {project.objectives.map((obj, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{obj.descripcion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* EDT Chart Placeholder */}
        <div style={{ marginBottom: '30px', pageBreakBefore: 'always' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>4. Estructura de Desglose de Tareas (EDT)</h3>
          <div id="edt-chart-container-pdf" style={{ padding: '10px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
            <p id="edt-placeholder-text" style={{display: 'block', margin:'10px'}}>Generando EDT...</p>
            <img id="edt-chart-img-placeholder" style={{ display: 'none', maxWidth: '100%', height: 'auto', border:'1px solid #ddd' }} alt="EDT Chart"/>
          </div>
        </div>

        {/* Gantt Chart Placeholder */}
        <div style={{ marginBottom: '30px', pageBreakBefore: 'always' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>5. Diagrama de Gantt</h3>
          <div id="gantt-chart-container-pdf" style={{ padding: '10px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
            <p id="gantt-placeholder-text" style={{display: 'block', margin:'10px'}}>Generando Diagrama de Gantt...</p>
            <img id="gantt-chart-img-placeholder" style={{ display: 'none', maxWidth: '100%', height: 'auto', border:'1px solid #ddd' }} alt="Gantt Chart"/>
          </div>
        </div>

        {/* Budget Matrix Placeholder */}
        <div style={{ marginBottom: '30px', pageBreakBefore: 'always' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>6. Matriz de Presupuesto</h3>
          <div id="budget-matrix-container-pdf" style={{ padding: '10px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
            <p id="presupuesto-placeholder-text" style={{display: 'block', margin:'10px'}}>Generando Matriz de Presupuesto...</p>
            <img id="presupuesto-chart-img-placeholder" style={{ display: 'none', maxWidth: '100%', height: 'auto', border:'1px solid #ddd' }} alt="Presupuesto Matrix"/>
          </div>
        </div>

        {/* Signatures Placeholder (Optional) */}
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #ccc', fontSize: '14px', pageBreakBefore: 'always' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>7. Aprobaciones</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <div style={{ textAlign: 'center', width: '45%' }}>
              <p>_________________________</p>
              <p>{project.owner?.nombre || 'Director del Proyecto'}</p>
              <p>Fecha: ___ / ___ / ______</p>
            </div>
            <div style={{ textAlign: 'center', width: '45%' }}>
              <p>_________________________</p>
              <p>Patrocinador del Proyecto (Sponsor)</p>
              <p>Fecha: ___ / ___ / ______</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '12px', color: '#777', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p>Documento generado el {new Date().toLocaleDateString()}</p>
          <p>Confidencialidad: Este documento es para uso interno y de los stakeholders del proyecto.</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectExportPDF;
