document.addEventListener('DOMContentLoaded', function() {
    const tapa = document.getElementById('EAC-tapa');
    const notas = document.getElementById('EAC-notas');
    const fichaTecnica = document.getElementById('EAC-fichaT');
    const fichaArtistica = document.getElementById('EAC-fichaA');
    const sinopse = document.getElementById('EAC-sinopse');
    const fotografias = document.getElementById('EAC-foto');
    const extras = document.getElementById('EAC-extras');
    const cerrar = document.getElementById('Cerrar');

    // Función para ocultar todas las imágenes excepto la tapa
    function ocultarTodas() {
        notas.style.display = 'none';
        fichaTecnica.style.display = 'none';
        botonFichatA.style.display = 'none';
        botonFichatB.style.display = 'none';
        botonFichatB1.style.display = 'none';
        botonFichatC.style.display = 'none';
        botonFichatD.style.display = 'none';
        botonFichatE.style.display = 'none';
        fichaArtistica.style.display = 'none';
        sinopse.style.display = 'none';
        fotografias.style.display = 'none';
        extras.style.display = 'none';
        
    }


    // Función para mostrar cada imagen individualmente
    function mostrarImagen(imagen) {
        ocultarTodas(); // Ocultar todas las imágenes
        imagen.style.display = 'block'; // Mostrar la imagen especificada

    if (imagen === fichaTecnica) 
        {botonFichatA.style.display = 'block';
         botonFichatB.style.display = 'block';
         botonFichatB1.style.display = 'block';
         botonFichatC.style.display = 'block';
         botonFichatD.style.display = 'block';
         botonFichatE.style.display = 'block';
    }
    
    if (imagen === fichaArtistica) 
        {botonFicharA.style.display = 'block';
         botonFicharB.style.display = 'block';}

    else{document.getElementById('botonFicharA').style.display = 'none';
         document.getElementById('botonFicharB').style.display = 'none';}

    if (imagen === fotografias)
        {InfoRodagem.style.display = 'block';
         GaleriaRodagem.style.display = 'block';
         InfoFrames.style.display = 'block';
         GaleriaFrames.style.display = 'block';}
 
      else {
         // Ocultar los elementos de fotografías si se muestra otra imagen
         document.getElementById('InfoRodagem').style.display = 'none';
         document.getElementById('GaleriaRodagem').style.display = 'none';
         document.getElementById('InfoFrames').style.display = 'none';
         document.getElementById('GaleriaFrames').style.display = 'none';} 
    
         if (imagen === extras)
         {GaleriaExtras.style.display = 'block';}
 
      else{ document.getElementById('GaleriaExtras').style.display = 'none';}}



        

    // Agregar eventos de clic a cada botón
    document.getElementById('Notascharlie').addEventListener('click', function() {
        mostrarImagen(notas);
    });

    document.getElementById('FichaTecnica').addEventListener('click', function() {
        mostrarImagen(fichaTecnica);
    });

    document.getElementById('FichaArtistica').addEventListener('click', function() {
        mostrarImagen(fichaArtistica);
    });

    document.getElementById('Sinopse').addEventListener('click', function() {
        mostrarImagen(sinopse);
    });

    document.getElementById('Fotografias').addEventListener('click', function() {
        mostrarImagen(fotografias);
    });

    document.getElementById('Extras').addEventListener('click', function() {
        mostrarImagen(extras);
    });

    // Agregar evento de clic a la tapa
    tapa.addEventListener('click', function() {
        tapa.style.display = 'none'; // Ocultar la tapa
        mostrarImagen(notas); // Mostrar la primera página del libro al hacer clic en la tapa
    });

    // Agregar evento de clic al botón Cerrar
    cerrar.addEventListener('click', function() {
        ocultarTodas(); // Ocultar todas las imágenes
        tapa.style.display = 'block'; // Mostrar solo la tapa al cerrar el libro
    });
});
