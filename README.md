AniWear: Explorando el Backend y la Conexión con Bases de Datos

Descripción:

AniWear es una aplicación de aprendizaje centrada en el desarrollo backend. Su objetivo principal es enseñar cómo establecer una comunicación efectiva entre una aplicación y una base de datos, utilizando tecnologías clave como Express, Mongoose y Handlebars.

Tecnologías Utilizadas:

Express: Framework web minimalista y flexible para Node.js.
Mongoose: Librería de modelado de objetos de MongoDB para Node.js, facilitando la interacción con la base de datos.
Handlebars: Motor de plantillas que permite generar contenido HTML dinámico de manera eficiente.
Cors: Middleware para habilitar el Intercambio de Recursos de Origen Cruzado (CORS), permitiendo solicitudes desde diferentes dominios.
Mongoose-Paginate-V2: Plugin para Mongoose que simplifica la paginación de resultados de consultas a la base de datos.
Cómo Empezar:

Clonar el Repositorio:
git clone https://github.com/r3id3n/backend-1_Valencia-Felipe

Instalar Dependencias:
npm install

Configurar Conexión a Mongo Atlas:

Crea un clúster en Mongo Atlas y obtén la cadena de conexión.
Reemplaza la cadena de conexión en el archivo de configuración de la aplicación.

Ejecutar el Proyecto:
node src/server.js

La aplicación se ejecutará en http://localhost:8080/list-products por defecto.

*******************************************************************************************************
Modificaciones.
Validadores del campo addProduct
Creación de carpeta src, encapsulando los repositorios de forma ordenada.
Creación de carpeta routes en paralelo a las vistas creadas en handlebars
Modificación en api/carts - routes/cart para el ingreso de productos a la base de datos Mongo Atlas agregando carritos por ID.
Información validada en la base de datos atlas 
Collections/aniwear.carts
las cantidades de producto en stock se va modificando en base al ingreso de carro de compras, a su vez al momento de eliminar producto del carro esta se va agregando al stock del producto.
