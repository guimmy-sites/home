let monedas = 100; // Número inicial de monedas
let inventario = []; // Array para almacenar las skins obtenidas
let cajaAbierta = false; // Variable para rastrear el estado de la caja

function abrirCaja() {
    if (!cajaAbierta && monedas >= 10) {
        cajaAbierta = true; // Marcar la caja como abierta
        monedas -= 10;
        actualizarHUD();

        // Mostrar animación de apertura de la caja
        let cajaContenedor = document.getElementById("cajaContenedor");
        let cajaImagen = document.getElementById("cajaImagen");
        
        cajaContenedor.classList.remove("shake", "closed");
        cajaContenedor.classList.add("open");

        // Iniciar la agitación durante la apertura de la caja
        setTimeout(() => {
            cajaContenedor.classList.add("shake");
        }, 0);

        // Mostrar la imagen de la skin después de la animación
        setTimeout(() => {
            let nuevaSkin = obtenerSkinAleatoria();
            inventario.push(nuevaSkin);
            actualizarUI();
            document.getElementById("animacionCaja").innerHTML = ""; // Limpiar la animación
            cajaContenedor.classList.remove("shake", "open"); // Detener la agitación y volver a cerrar la caja
            cajaContenedor.classList.add("closed");
            cajaAbierta = false; // Marcar la caja como cerrada después de mostrar la skin
        }, 2000); // Simulando una animación de 2 segundos
    } else if (cajaAbierta) {
        alert("Ya abriste una caja. Espera a ver la skin antes de abrir otra.");
    } else {
        alert("No tienes suficientes monedas para abrir una caja.");
    }
}

function obtenerSkinAleatoria() {
    // Definir las probabilidades de cada skin
    const probabilidades = {
        "Skin Común": 40,
        "Skin Poco Común": 30,
        "Skin Rara": 20,
        "Skin Épica": 8,
        "Skin Legendaria": 2
    };

    // Calcular la probabilidad total
    const totalProbabilidades = Object.values(probabilidades).reduce((acc, prob) => acc + prob, 0);

    // Generar un número aleatorio entre 1 y la probabilidad total
    let randomNumber = Math.floor(Math.random() * totalProbabilidades) + 1;

    // Determinar la skin basada en el número aleatorio
    let acumulado = 0;
    for (let skin in probabilidades) {
        acumulado += probabilidades[skin];
        if (randomNumber <= acumulado) {
            // Has obtenido esta skin
            let valor = obtenerValorAleatorio(skin); // Función para obtener un valor ajustado según la rareza
            mostrarMensajeSkin(skin, valor);
            return {
                nombre: skin,
                valor: valor,
                imagen: `imagen_${skin.toLowerCase().replace(/\s/g, "_")}.jpg`
            };
        }
    }
}

function obtenerValorAleatorio(tipoSkin) {
    // Función para obtener un valor aleatorio ajustado según la rareza de la skin
    switch (tipoSkin) {
        case "Skin Común":
            return Math.max(Math.floor(Math.random() * 5) + 1, 1); // Valor entre 1 y 5 monedas, con un mínimo de 1
        case "Skin Poco Común":
            return Math.max(Math.floor(Math.random() * 10) + 1, 5); // Valor entre 5 y 10 monedas, con un mínimo de 5
        case "Skin Rara":
            return Math.max(Math.floor(Math.random() * 20) + 1, 10); // Valor entre 10 y 20 monedas, con un mínimo de 10
        case "Skin Épica":
            return Math.max(Math.floor(Math.random() * 40) + 1, 20); // Valor entre 20 y 40 monedas, con un mínimo de 20
        case "Skin Legendaria":
            return Math.max(Math.floor(Math.random() * 100) + 1, 40); // Valor entre 40 y 100 monedas, con un mínimo de 40
        default:
            return 1; // Valor predeterminado
    }
}

function mostrarMensajeSkin(skin, valor) {
    // Mostrar la imagen de la skin y su valor en monedas
    let mensaje = `<p>¡Has obtenido la skin: ${skin}!</p>`;
    mensaje += `<p>Valor: ${valor} monedas</p>`;
    document.getElementById("animacionCaja").innerHTML = mensaje;
}

function venderSkin(index) {
    if (index >= 0 && index < inventario.length) {
        let skinVendida = inventario.splice(index, 1)[0];
        monedas += skinVendida.valor;
        actualizarUI();
        alert(`Has vendido la skin ${skinVendida.nombre} por ${skinVendida.valor} monedas.`);
    }
}

function actualizarHUD() {
    document.getElementById("monedas").textContent = monedas;
}

function actualizarUI() {
    // Actualizar la interfaz de usuario con las monedas y el inventario
    actualizarHUD();

    let listaSkins = document.getElementById("listaSkins");
    listaSkins.innerHTML = "";
    for (let i = inventario.length - 1; i >= 0; i--) { // Recorremos el inventario desde el final para añadir las skins más recientes arriba
        let listItem = document.createElement("li");

        // Crear imagen de la skin
        let skinImagen = document.createElement("img");
        skinImagen.src = inventario[i].imagen;
        skinImagen.alt = inventario[i].nombre;
        skinImagen.style.maxWidth = "50px";
        skinImagen.style.borderRadius = "5px";
        listItem.appendChild(skinImagen);

        // Agregar nombre y valor
        let skinInfo = document.createElement("div");
        skinInfo.textContent = `${inventario[i].nombre} - ${inventario[i].valor} monedas`;

        // Agregar botón de vender
        let venderBtn = document.createElement("button");
        venderBtn.textContent = "Vender";
        venderBtn.id = `venderBtn${i}`;
        venderBtn.onclick = function() {
            venderSkin(i);
        };
        
        // Agregar elementos al listItem
        listItem.appendChild(skinInfo);
        listItem.appendChild(venderBtn);

        // Estilo del listItem
        listItem.style.marginBottom = "20px";
        listItem.style.padding = "20px";
        listItem.style.backgroundColor = "#eee";
        listItem.style.borderRadius = "10px";
        listItem.style.display = "flex";
        listItem.style.justifyContent = "space-between";
        listItem.style.alignItems = "center";

        // Agregar listItem a la listaSkins
        listaSkins.appendChild(listItem);
    }
}

function venderTodo() {
    if (inventario.length > 0) {
        let totalMonedas = inventario.reduce((total, skin) => total + skin.valor, 0);
        monedas += totalMonedas;
        inventario = [];
        actualizarUI();
        alert(`Has vendido todas las skins por ${totalMonedas} monedas.`);
    } else {
        alert("No tienes skins para vender.");
    }
}