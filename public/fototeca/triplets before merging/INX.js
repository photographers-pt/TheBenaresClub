document.addEventListener('DOMContentLoaded', function() {
    const tapa = document.getElementById('INX-tapa');
    const notas = document.getElementById('INX-notas');
    const fichaTecnica = document.getElementById('INX-fichaT');
    const fichaArtistica = document.getElementById('INX-fichaA');
    const sinopse = document.getElementById('INX-sinopse');
    const fotografias = document.getElementById('INX-foto');
    const extras = document.getElementById('INX-extras');
    const cerrar = document.getElementById('Cerrar');

    // Función para ocultar todas las imágenes excepto la tapa
    function ocultarTodas() {
        notas.style.display = 'none';
        fichaTecnica.style.display = 'none';
        botonFichatA.style.display = 'none';
        botonFichatB.style.display = 'none';
        fichaArtistica.style.display = 'none';
        botonFicharA.style.display = 'none';
        botonFicharB.style.display = 'none';
        botonFicharC.style.display = 'none';
        botonFicharE.style.display = 'none';
        botonFicharD.style.display = 'none';
        sinopse.style.display = 'none';
        fotografias.style.display = 'none';
        InfoRodagem.display = 'none';
        GaleriaRodagem.display = 'none';
        InfoFrames.display = 'none';
        GaleriaFrames.display = 'none';
        extras.style.display = 'none';
        GaleriaExtras.display = 'none';
        GaleriaExtrasA.display = 'none';

    }

    // Función para mostrar cada imagen individualmente
    function mostrarImagen(imagen) {
        ocultarTodas(); // Ocultar todas las imágenes
        imagen.style.display = 'block'; // Mostrar la imagen especificada

        // Mostrar los botones correspondientes a la ficha técnica si se muestra esa imagen
        if (imagen === fichaTecnica) 
        {botonFichatA.style.display = 'block';
         botonFichatB.style.display = 'block';}

        if (imagen === fichaArtistica) 
        {botonFicharA.style.display = 'block';
         botonFicharB.style.display = 'block';
         botonFicharC.style.display = 'block';
         botonFicharE.style.display = 'block';
         botonFicharD.style.display = 'block';}

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
        {GaleriaExtras.style.display = 'block';
         GaleriaExtrasA.style.display = 'block';
        }

     else{ document.getElementById('GaleriaExtras').style.display = 'none';
        document.getElementById('GaleriaExtrasA').style.display = 'none';
     }}



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

