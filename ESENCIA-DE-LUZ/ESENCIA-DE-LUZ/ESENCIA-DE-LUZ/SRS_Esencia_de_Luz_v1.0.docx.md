
**ESENCIA DE LUZ**

*Documento de Especificación de Requisitos de Software*

Software Requirements Specification (SRS)

Estándar IEEE 830 — Revisión 1.0

Versión: 1.0.0  |  Clasificación: Confidencial

Fecha de Emisión: Marzo 2026

| Campo | Detalle |
| ----- | ----- |
| Proyecto | Esencia de Luz — Plataforma E-Commerce |
| Tipo de Documento | SRS — Software Requirements Specification |
| Versión | 1.0.0 |
| Estado | Aprobado para Auditoría |
| Estándar Aplicado | IEEE Std 830-1998 |
| Fecha de Emisión | Marzo 2026 |
| Clasificación | Documento Confidencial |

# **Tabla de Contenido**

# **1\. Introducción**

## **1.1 Propósito del Documento**

El presente documento constituye la Especificación de Requisitos de Software (SRS) para el sistema de comercio electrónico denominado Esencia de Luz. Su redacción sigue los lineamientos del estándar IEEE Std 830-1998, con el propósito de proporcionar una descripción precisa, completa y verificable de las funcionalidades que el sistema debe implementar, las restricciones bajo las cuales debe operar y los atributos de calidad que debe cumplir.

Este documento está dirigido a los siguientes grupos de interés:

* Equipo de desarrollo Full-Stack responsable de la implementación técnica.

* Equipo de aseguramiento de calidad (QA) encargado de la validación funcional y no funcional.

* Arquitectos de software y revisores técnicos senior.

* Auditores internos o externos que requieran evidencia documental del diseño del sistema.

* Partes interesadas del negocio con necesidad de supervisar el alcance del proyecto.

El documento debe interpretarse como la fuente de verdad técnica del proyecto durante su ciclo de vida de desarrollo. Cualquier modificación al alcance o a los requisitos aquí definidos deberá ser aprobada formalmente mediante un proceso de control de cambios.

## **1.2 Alcance del Sistema**

Esencia de Luz es una plataforma de comercio electrónico de ciclo completo, diseñada específicamente para la comercialización de productos artesanales y de bienestar. El sistema abarca la totalidad del ciclo de vida de una transacción comercial en línea: desde la navegación y descubrimiento de productos hasta la gestión de pedidos y la confirmación de compra.

El sistema provee las siguientes capacidades de alto nivel:

* Gestión dinámica de catálogo de productos conectada en tiempo real a una base de datos relacional.

* Sistema de autenticación y autorización seguro basado en tokens JWT y hashing de contraseñas con bcryptjs.

* Flujo de compra completo: carrito reactivo, generación de orden, persistencia en base de datos y despacho de confirmación vía WhatsApp Business API.

* Infraestructura de inicialización automática del entorno de datos (Auto-seeding y auto-provisioning).

* Interfaz de usuario premium con diseño estético coherente, accesible desde dispositivos móviles y de escritorio.

El proyecto excluye explícitamente de su alcance en esta versión (v1.0): integración con pasarelas de pago electrónico en línea, panel de administración CMS para gestión de inventario por parte del negocio, y soporte para múltiples monedas o idiomas.

## **1.3 Definiciones, Acrónimos y Abreviaturas**

| Término / Acrónimo | Definición |
| ----- | ----- |
| SRS | Software Requirements Specification — Especificación de Requisitos de Software, documento formal que describe el comportamiento esperado de un sistema. |
| IEEE 830 | Estándar del Instituto de Ingenieros Eléctricos y Electrónicos para la elaboración de especificaciones de requisitos de software, versión 1998\. |
| API REST | Application Programming Interface basada en los principios de Representational State Transfer. Permite la comunicación stateless entre cliente y servidor mediante verbos HTTP. |
| JWT | JSON Web Token. Estándar abierto (RFC 7519\) para la transmisión segura de información entre partes como un objeto JSON firmado digitalmente. |
| Bcryptjs | Biblioteca de JavaScript que implementa el algoritmo de hashing adaptativo bcrypt para el almacenamiento seguro de contraseñas mediante función unidireccional con sal criptográfica. |
| ORM | Object-Relational Mapping. Técnica de programación para convertir datos entre sistemas de tipos incompatibles usando paradigmas orientados a objetos. |
| CRUD | Create, Read, Update, Delete. Conjunto de operaciones fundamentales sobre datos persistentes. |
| Seeding | Proceso automatizado de inserción de datos iniciales o de prueba en una base de datos vacía para garantizar un estado mínimo de operación. |
| Frontend | Capa de presentación del sistema; el conjunto de interfaces de usuario con las que interactúa directamente el cliente final. |
| Backend | Capa de lógica de negocio y acceso a datos del sistema; opera en el servidor, invisible para el usuario final. |
| WhatsApp API | API de WhatsApp Business que permite la generación de mensajes pre-formateados para la confirmación de pedidos mediante el protocolo wa.me. |
| Middleware | Software que actúa como puente entre el cliente HTTP y la lógica de negocio en el servidor Express.js, aplicando validaciones, autenticación o transformación de datos en la cadena de procesamiento de una solicitud. |
| DDL | Data Definition Language. Subconjunto de SQL utilizado para definir y modificar la estructura de la base de datos (CREATE, ALTER, DROP). |
| DML | Data Manipulation Language. Subconjunto de SQL para manipular datos (INSERT, UPDATE, DELETE, SELECT). |
| ES6+ | ECMAScript 2015 y versiones posteriores. Define las características modernas del lenguaje JavaScript como arrow functions, clases, módulos, promesas y async/await. |

## **1.4 Referencias Normativas**

* IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.

* RFC 7519: JSON Web Token (JWT) — IETF, May 2015\.

* RFC 2616: Hypertext Transfer Protocol (HTTP/1.1) — IETF.

* OWASP Top 10 (2021): Guía de referencia para mitigación de vulnerabilidades en aplicaciones web.

* MySQL 8.0 Reference Manual — Oracle Corporation.

* Node.js v18+ LTS Documentation — OpenJS Foundation.

* Express.js v4.x API Reference.

## **1.5 Visión General del Documento**

El presente SRS se organiza en cinco secciones principales. La Sección 1 establece el contexto documental mediante propósito, alcance, definiciones y referencias. La Sección 2 provee una descripción general del sistema incluyendo perspectiva del producto, funciones principales, perfiles de usuario y restricciones tecnológicas. La Sección 3 detalla los requisitos específicos funcionales y no funcionales. La Sección 4 describe el diseño de la arquitectura del sistema, incluyendo el modelo entidad-relación y el flujo de datos. La Sección 5 inventaria las tecnologías utilizadas con su justificación técnica.

# **2\. Descripción General del Sistema**

## **2.1 Perspectiva del Producto**

Esencia de Luz es un sistema de software autónomo y de nueva creación (greenfield project), sin dependencias heredadas de sistemas legacy. Se concibe como una aplicación web Full-Stack con arquitectura cliente-servidor de tres capas, donde la capa de presentación (frontend) se comunica exclusivamente con la capa de lógica de negocio (backend API) mediante llamadas HTTP/REST, y esta a su vez gestiona la capa de persistencia (base de datos relacional MySQL).

El sistema está diseñado para operar en entornos de servidor convencionales o contenedorizados (compatibilidad Docker prevista para versiones futuras). Desde la perspectiva del usuario, Esencia de Luz se presenta como una tienda en línea de alto valor estético, donde los clientes pueden explorar un catálogo de productos artesanales, gestionar su cuenta personal y completar procesos de compra de manera segura e intuitiva.

## **2.2 Funciones Principales del Sistema**

A continuación se describen las macro-funciones que el sistema debe proveer:

### **2.2.1 Gestión de Identidad y Sesiones**

El sistema implementa un mecanismo completo de autenticación y autorización. Los usuarios pueden registrar nuevas cuentas, iniciar sesión de forma segura y mantener sesiones persistentes mediante tokens JWT almacenados en el cliente. El ciclo de vida de la sesión es gestionado de manera completamente stateless en el servidor.

### **2.2.2 Catálogo de Productos**

El catálogo se renderiza dinámicamente a partir de los datos persistidos en la base de datos MySQL. Cada producto expone atributos completos incluyendo nombre, descripción detallada, precio con precisión decimal, disponibilidad de stock en tiempo real, categoría y URL de imagen. El sistema aplica filtrado por categoría y puede extenderse con funcionalidades de búsqueda.

### **2.2.3 Carrito de Compras Reactivo**

El carrito de compras opera en memoria del cliente y refleja en tiempo real las operaciones de adición, modificación de cantidad y eliminación de ítems. Calcula automáticamente totales y subtotales. El estado del carrito persiste durante la sesión del usuario y es serializado para su transmisión al backend en el momento de confirmar el pedido.

### **2.2.4 Ciclo de Vida del Pedido**

Al confirmar una compra, el sistema ejecuta una transacción atómica que registra el pedido principal en la tabla orders y el detalle de cada ítem en la tabla order\_items. Simultáneamente, genera un enlace de confirmación vía WhatsApp Business API con el resumen del pedido pre-formateado. El sistema soporta estados de pedido (pendiente, pagado, en procesamiento, enviado, entregado, cancelado).

### **2.2.5 Gestión de Perfil de Usuario**

Los usuarios autenticados pueden visualizar y actualizar su información de perfil incluyendo nombre completo, número de teléfono, dirección de envío y ciudad de residencia. Esta información se utiliza para pre-poblar formularios en el proceso de checkout.

### **2.2.6 Auto-Provisioning de Infraestructura de Datos**

El motor de arranque del backend ejecuta, en cada inicio del servidor, una secuencia de verificación que garantiza la existencia de la base de datos, la correcta estructura de todas las tablas y la presencia de datos semilla mínimos para la operación del catálogo. Este proceso es idempotente y no altera datos preexistentes.

## **2.3 Características y Perfiles de Usuario**

| Perfil | Descripción | Interacciones Principales | Nivel Técnico |
| ----- | ----- | ----- | ----- |
| Cliente Anónimo | Visitante sin autenticación | Explorar catálogo, ver detalle de productos, acceder a registro/login | No técnico |
| Cliente Registrado | Usuario con cuenta activa y sesión JWT válida | Todo lo anterior \+ Carrito, checkout, gestión de perfil, historial de pedidos | No técnico |
| Administrador del Sistema | Personal técnico con acceso directo a la base de datos y al servidor | Gestión de inventario via DB, monitoreo de logs, mantenimiento del servidor | Técnico avanzado |

## **2.4 Restricciones Tecnológicas y Operacionales**

### **2.4.1 Restricciones de Plataforma**

* El backend Node.js requiere un entorno de ejecución Node.js versión 18 LTS o superior.

* La base de datos debe ser MySQL 8.0 o superior para soporte completo de UTF8MB4, tipos JSON y disparadores.

* El frontend está diseñado para navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) con soporte nativo de ES6 Modules y Fetch API.

* No se requiere herramienta de compilación (bundler) para el frontend en esta versión; JavaScript Vanilla opera directamente sobre el servidor de archivos estáticos de Express.

### **2.4.2 Restricciones de Seguridad**

* Todas las contraseñas deben almacenarse exclusivamente como hashes bcrypt con un factor de coste mínimo de 10 rondas. Ningún módulo del sistema puede acceder o transmitir contraseñas en texto plano.

* Los tokens JWT deben incluir tiempo de expiración (exp claim) y firmarse con un secreto de al menos 256 bits de entropía configurado como variable de entorno.

* Las variables sensibles de configuración (credenciales de base de datos, secreto JWT) deben gestionarse mediante variables de entorno y no deben incluirse en el repositorio de código fuente.

### **2.4.3 Restricciones de Disponibilidad de Red**

* La integración con WhatsApp Business API requiere que el cliente tenga conexión a Internet activa en el momento de confirmar el pedido.

* El sistema no implementa caché de capa de aplicación en esta versión; todas las consultas al catálogo acceden directamente a MySQL.

### **2.4.4 Restricciones de Mantenibilidad**

* Toda la comunicación cliente-servidor debe canalizarse a través del módulo centralizado api-client.js, prohibiéndose llamadas fetch directas desde otros módulos del frontend.

* El esquema de base de datos debe documentarse mediante scripts DDL versionados.

# **3\. Requisitos Específicos**

## **3.1 Requisitos Funcionales**

### **RF-01 — Registro de Nuevo Usuario**

| Identificador | RF-01 |
| :---- | :---- |
| Nombre | Registro de Nuevo Usuario |
| Prioridad | Alta — Crítico |
| Descripción | El sistema debe permitir a un usuario anónimo crear una cuenta nueva proporcionando dirección de correo electrónico y contraseña. El sistema debe validar que el correo no esté previamente registrado, aplicar hashing bcrypt a la contraseña antes del almacenamiento y crear registros asociados en las tablas users y profiles de forma transaccional. |
| Entradas | email (string, formato RFC 5321), password (string, mínimo 8 caracteres), confirmPassword (string, debe coincidir con password) |
| Precondiciones | El correo electrónico no debe existir en la tabla users. La conexión con MySQL debe estar activa. |
| Proceso | 1\) Validar formato de email. 2\) Verificar unicidad en DB. 3\) Hashear password con bcryptjs (saltRounds=10). 4\) Insertar en users (id UUID, email, password\_hash). 5\) Insertar en profiles (user\_id FK). 6\) Retornar JWT firmado. |
| Salidas | Token JWT válido con payload {userId, email, exp}. HTTP 201 Created. |
| Errores | HTTP 409 si email duplicado. HTTP 422 si validación falla. HTTP 500 en error de base de datos. |

### **RF-02 — Autenticación de Usuario (Login)**

| Identificador | RF-02 |
| :---- | :---- |
| Nombre | Autenticación de Usuario (Login) |
| Prioridad | Alta — Crítico |
| Descripción | El sistema debe autenticar a un usuario registrado comparando las credenciales proporcionadas con los datos almacenados. La verificación de contraseña debe realizarse mediante bcrypt.compare() sobre el hash almacenado. Ante credenciales incorrectas, el sistema no debe indicar cuál campo es incorrecto (protección contra enumeración de usuarios). |
| Entradas | email (string), password (string) |
| Proceso | 1\) Buscar usuario por email en DB. 2\) Comparar password con hash via bcrypt.compare(). 3\) Si válido: generar y retornar JWT. 4\) Si inválido: retornar error genérico. |
| Salidas | Token JWT con payload {userId, email, iat, exp}. HTTP 200 OK. |
| Errores | HTTP 401 con mensaje genérico ante credenciales incorrectas. HTTP 422 ante entrada malformada. |

### **RF-03 — Navegación y Consulta del Catálogo de Productos**

| Identificador | RF-03 |
| :---- | :---- |
| Nombre | Consulta de Catálogo |
| Prioridad | Alta — Crítico |
| Descripción | El sistema debe exponer un endpoint público que retorne la lista completa de productos activos desde la tabla products, incluyendo todos sus atributos. Debe soportar filtrado opcional por categoría mediante query parameter. El acceso no requiere autenticación. |
| Endpoint | GET /api/products | GET /api/products?category={categoria} |
| Salidas | Array JSON de objetos producto: {id, name, description, price, stock, image\_url, category}. HTTP 200 OK. |
| Condiciones | Solo se retornan productos con stock \> 0 o stock IS NULL (sin gestión de stock). La respuesta debe incluir la URL de imagen para renderizado en el frontend. |

### **RF-04 — Gestión del Carrito de Compras**

| Identificador | RF-04 |
| :---- | :---- |
| Nombre | Carrito de Compras Reactivo |
| Prioridad | Alta — Crítico |
| Descripción | El sistema frontend debe mantener un estado de carrito en memoria que permita: agregar productos (con validación de stock), modificar cantidades, eliminar ítems individuales, vaciar el carrito y calcular el total en tiempo real. El carrito se representa como un Map o Array de objetos {productId, name, price, quantity, subtotal}. |
| Funciones | addToCart(product, qty), updateQuantity(productId, qty), removeItem(productId), clearCart(), getTotal() |
| Persistencia | El carrito persiste durante la sesión activa del navegador. No se persiste en base de datos hasta la confirmación del pedido. |
| UI | El contador del carrito en el header debe actualizarse reactivamente ante cualquier cambio. El modal/panel del carrito muestra ítems, cantidades, subtotales y total. |

### **RF-05 — Creación y Registro de Pedido**

| Identificador | RF-05 |
| :---- | :---- |
| Nombre | Creación de Pedido (Checkout) |
| Prioridad | Alta — Crítico |
| Descripción | El sistema debe permitir al usuario autenticado confirmar el contenido de su carrito y generar un pedido persistido en la base de datos. La operación debe ser atómica: si falla la inserción de cualquier order\_item, la transacción completa debe revertirse (ROLLBACK). |
| Precondiciones | Usuario autenticado con JWT válido. Carrito con al menos un ítem. Stock suficiente para todos los productos. |
| Proceso | 1\) Validar JWT. 2\) Verificar stock de cada ítem en DB. 3\) BEGIN TRANSACTION. 4\) INSERT en orders (user\_id, total\_amount, status='pendiente'). 5\) INSERT en order\_items por cada ítem. 6\) COMMIT. 7\) Generar URL WhatsApp con resumen. 8\) Retornar order\_id y URL WhatsApp. |
| Salidas | HTTP 201 Created con {orderId, whatsappUrl, totalAmount, status}. |
| Errores | HTTP 401 si no autenticado. HTTP 409 si stock insuficiente. HTTP 500 en fallo de transacción con ROLLBACK garantizado. |

### **RF-06 — Generación de Confirmación vía WhatsApp**

| Identificador | RF-06 |
| :---- | :---- |
| Nombre | Confirmación de Pedido por WhatsApp |
| Prioridad | Media — Importante |
| Descripción | Tras la creación exitosa del pedido, el sistema debe construir y presentar al usuario un enlace wa.me pre-formateado que incluya el número de pedido, el listado de productos comprados con cantidades, y el monto total. Al hacer clic, el usuario es redirigido a WhatsApp con el mensaje pre-cargado para enviarlo al número de atención del negocio. |
| Formato URL | <https://wa.me/{NUMERO\_NEGOCIO}?text={MENSAJE\_URLENCODED}> |
| Contenido Mensaje | Pedido \#{orderId} \- Esencia de Luz\\nProductos: {lista}\\nTotal: ${total}\\nSolicito confirmar mi pedido. |

### **RF-07 — Gestión de Perfil de Usuario**

| Identificador | RF-07 |
| :---- | :---- |
| Nombre | Visualización y Actualización de Perfil |
| Prioridad | Media — Importante |
| Descripción | El sistema debe permitir al usuario autenticado consultar y modificar su información de perfil almacenada en la tabla profiles. Los campos editables son: full\_name, phone, address y city. El campo email (en la tabla users) no es modificable. |
| Endpoints | GET /api/profile — Obtiene perfil. PATCH /api/profile — Actualiza campos parciales. |
| Seguridad | Ambos endpoints requieren JWT válido. El user\_id se extrae del token, nunca del cuerpo de la petición. |

### **RF-08 — Módulo Centralizado de Cliente API (api-client.js)**

| Identificador | RF-08 |
| :---- | :---- |
| Nombre | Cliente API Centralizado |
| Prioridad | Alta — Arquitectural |
| Descripción | Debe existir un único módulo JavaScript (api-client.js) en el frontend que centralice todas las llamadas HTTP a la API REST del backend. Este módulo debe gestionar: adjuntar el token JWT en el header Authorization: Bearer {token} en todas las peticiones autenticadas, serializar/deserializar JSON, manejar errores HTTP de forma uniforme, y exponer funciones named para cada operación (login, register, getProducts, createOrder, getProfile, updateProfile). |
| Restricción | Ningún otro módulo del frontend puede realizar llamadas fetch directamente a la API. Toda comunicación con el backend debe pasar exclusivamente por api-client.js. |

## **3.2 Requisitos No Funcionales**

### **RNF-01 — Seguridad de Datos y Autenticación**

| Identificador | RNF-01 |
| :---- | :---- |
| Categoría | Seguridad |
| Requisito | Las contraseñas NUNCA deben almacenarse, transmitirse o registrarse en logs en texto plano. El algoritmo de hashing bcrypt debe configurarse con un factor de coste (saltRounds) mínimo de 10, garantizando un tiempo de cómputo mínimo de 100ms por operación de hashing en hardware estándar. |
| Requisito | Los tokens JWT deben tener un tiempo de expiración máximo de 24 horas. El secreto de firma debe tener una entropía mínima de 256 bits y almacenarse exclusivamente como variable de entorno (process.env.JWT\_SECRET). |
| Requisito | El sistema debe implementar protección CORS configurada explícitamente para solo aceptar peticiones desde el origen autorizado del frontend. |
| Requisito | Las rutas protegidas de la API deben validar el JWT en cada petición mediante middleware de autenticación. El rechazo debe retornar HTTP 401 sin revelar detalles del error de validación. |
| Métrica | 0% de contraseñas almacenadas en texto plano. 100% de rutas protegidas con middleware JWT. |

### **RNF-02 — Rendimiento y Escalabilidad de la Base de Datos**

| Identificador | RNF-02 |
| :---- | :---- |
| Categoría | Rendimiento / Escalabilidad |
| Requisito | El tiempo de respuesta del endpoint GET /api/products no debe superar los 500ms para un catálogo de hasta 1,000 productos en condiciones de carga normal (hasta 50 usuarios concurrentes). |
| Requisito | La tabla products debe indexar las columnas category e id para optimizar consultas de filtrado y búsqueda por clave primaria. La tabla order\_items debe indexar order\_id y product\_id. |
| Requisito | El sistema de auto-provisioning debe completar la secuencia de verificación e inicialización de base de datos en menos de 5 segundos en el arranque del servidor. |
| Requisito | El sistema debe utilizar un pool de conexiones MySQL (mínimo 5, máximo 20 conexiones) para evitar la sobrecarga de apertura/cierre de conexiones en cada petición. |
| Métrica | Tiempo de respuesta P95 \< 500ms. Disponibilidad \> 99% en entorno de producción. |

### **RNF-03 — Usabilidad y Experiencia de Usuario**

| Identificador | RNF-03 |
| :---- | :---- |
| Categoría | Usabilidad |
| Requisito | La interfaz debe seguir los principios de diseño responsive, adaptándose correctamente a resoluciones desde 320px (móvil) hasta 2560px (pantallas 4K) sin pérdida de funcionalidad. |
| Requisito | El carrito de compras debe actualizarse visualmente en menos de 100ms tras cualquier interacción del usuario, garantizando una sensación de inmediatez. |
| Requisito | Los estados de error en formularios deben comunicarse con mensajes descriptivos en lenguaje natural (español), ubicados en proximidad al campo que los originó. |
| Requisito | El sistema debe mostrar indicadores visuales de carga (spinners o skeletons) durante operaciones asíncronas que superen los 200ms de duración. |
| Métrica | Tasa de completitud del flujo de checkout superior al 80% en pruebas de usabilidad con usuarios no técnicos. |

### **RNF-04 — Mantenibilidad y Calidad del Código**

| Identificador | RNF-04 |
| :---- | :---- |
| Categoría | Mantenibilidad |
| Requisito | El backend debe estructurarse en capas separadas: routes/ (definición de endpoints), controllers/ (lógica de negocio), models/ (acceso a datos) y middleware/ (interceptores). Ninguna capa debe acceder directamente a la capa de datos de otra. |
| Requisito | Todas las operaciones asíncronas deben implementarse usando async/await con manejo explícito de errores mediante try/catch. No se permite el uso de callbacks sin promisificación. |
| Requisito | El sistema debe registrar en logs (nivel INFO, WARN, ERROR) todas las peticiones entrantes, errores de base de datos y fallos de autenticación, con timestamps ISO 8601\. |

### **RNF-05 — Disponibilidad y Recuperabilidad**

* El servidor backend debe implementar manejo global de excepciones no capturadas (uncaughtException, unhandledRejection) para evitar cierres inesperados del proceso Node.js.

* El motor de auto-provisioning debe ser idempotente: su ejecución repetida no debe duplicar datos ni alterar el estado de una base de datos ya inicializada.

* Ante fallo en la conexión de base de datos, el servidor debe retornar HTTP 503 Service Unavailable con un mensaje de error controlado, sin exponer detalles internos de la infraestructura.

# **4\. Diseño de Arquitectura del Sistema**

## **4.1 Arquitectura General — Modelo de Tres Capas**

El sistema Esencia de Luz adopta una arquitectura de tres capas lógicas distribuidas (Three-Tier Architecture), con separación estricta de responsabilidades entre presentación, lógica de negocio y persistencia de datos. Esta separación garantiza escalabilidad horizontal independiente de cada capa y facilita el mantenimiento y las pruebas unitarias de cada componente.

| CAPA 1 — PRESENTACIÓN (Frontend) HTML5 Semántico  |  CSS3 Avanzado con Variables de Diseño  |  JavaScript ES6+ (Vanilla) |
| :---: |
| **HTTP/REST  ←→  api-client.js  (Authorization: Bearer JWT)** |
| **CAPA 2 — LÓGICA DE NEGOCIO (Backend API)** Node.js v18+  |  Express.js v4  |  Middleware JWT  |  bcryptjs  |  Enrutamiento REST |
| **MySQL2 Driver  ←→  Connection Pool (5–20 conns)  ←→  Transacciones ACID** |
| **CAPA 3 — PERSISTENCIA (Base de Datos)** MySQL 8.0  |  Esquema esencia\_de\_luz  |  Integridad Referencial  |  Disparadores |

## **4.2 Modelo Entidad-Relación (ER)**

El esquema de base de datos esencia\_de\_luz se compone de cinco entidades principales con las siguientes relaciones de integridad referencial:

| Tabla | PK | Columnas Principales | FK / Relaciones | Tipo Relación |
| ----- | ----- | ----- | ----- | ----- |
| users | id (UUID) | email VARCHAR(255) UNIQUE NOT NULL, password\_hash VARCHAR(255) NOT NULL, created\_at TIMESTAMP | — | Entidad raíz |
| profiles | id (UUID) | full\_name, phone, address, city | user\_id → users.id (CASCADE DELETE) | 1:1 con users |
| products | id (UUID) | name, description TEXT, price DECIMAL(10,2), stock INT, image\_url, category | — | Entidad independiente |
| orders | id (UUID) | total\_amount DECIMAL(10,2), status ENUM, created\_at TIMESTAMP | user\_id → users.id (RESTRICT) | N:1 con users |
| order\_items | id (UUID) | quantity INT NOT NULL, unit\_price DECIMAL(10,2) | order\_id → orders.id (CASCADE), product\_id → products.id (RESTRICT) | N:1 con orders, N:1 con products |

Las restricciones de integridad referencial siguen las siguientes políticas:

* CASCADE DELETE entre users y profiles: al eliminar un usuario, su perfil se elimina automáticamente.

* CASCADE DELETE entre orders y order\_items: al eliminar un pedido, todos sus ítems se eliminan automáticamente.

* RESTRICT entre users y orders: no es posible eliminar un usuario que tenga pedidos asociados.

* RESTRICT entre products y order\_items: no es posible eliminar un producto que haya sido parte de un pedido histórico.

## **4.3 Flujo de Datos — Ciclo de Vida de una Petición**

### **4.3.1 Flujo de Autenticación (Login)**

| Paso | Actor / Componente | Acción | Resultado |
| ----- | ----- | ----- | ----- |
| 1 | Usuario → Browser | Ingresa email y password en formulario de login | Datos en memoria del DOM |
| 2 | api-client.js | POST /api/auth/login con {email, password} en JSON body | Petición HTTP al servidor |
| 3 | Express Router | Recibe petición, valida Content-Type, invoca controller | Control pasa a authController |
| 4 | authController | Busca usuario en DB por email. Ejecuta bcrypt.compare() | Verificación criptográfica |
| 5 | authController | Si válido: genera JWT firmado con jwt.sign() | Token JWT con exp=24h |
| 6 | Express | Retorna HTTP 200 con {token, user} | Respuesta JSON al cliente |
| 7 | api-client.js | Almacena token en localStorage o variable de sesión | Sesión establecida en cliente |

### **4.3.2 Flujo de Creación de Pedido (Checkout)**

| Paso | Actor / Componente | Acción | Resultado |
| ----- | ----- | ----- | ----- |
| 1 | Usuario → Frontend | Confirma carrito y hace clic en 'Realizar Pedido' | Trigger de función checkout() |
| 2 | api-client.js | POST /api/orders con JWT en header y {items, total} en body | Petición autenticada al servidor |
| 3 | Middleware JWT | Verifica firma y expiración del token. Extrae userId | userId disponible en req.user |
| 4 | orderController | Valida stock de cada producto en DB | Verificación de inventario |
| 5 | orderController | BEGIN TRANSACTION. INSERT en orders. | Pedido principal creado |
| 6 | orderController | INSERT en order\_items por cada producto del carrito | Detalle del pedido registrado |
| 7 | orderController | COMMIT. Genera whatsappUrl con resumen | Transacción confirmada |
| 8 | Express | HTTP 201 con {orderId, whatsappUrl, total} | Confirmación al cliente |
| 9 | Frontend | Vacía carrito. Muestra confirmación. Ofrece link WhatsApp | UX de confirmación exitosa |

## **4.4 Estructura de Directorios del Proyecto**

La organización del proyecto en el sistema de archivos sigue las convenciones de una aplicación Express.js modular:

esencia-de-luz/

├── backend/

│   ├── config/

│   │   ├── database.js          \# Pool de conexiones MySQL

│   │   └── init.js              \# Motor de auto-provisioning

│   ├── controllers/

│   │   ├── authController.js    \# Lógica de registro y login

│   │   ├── productController.js \# Lógica de catálogo

│   │   ├── orderController.js   \# Lógica de pedidos

│   │   └── profileController.js \# Lógica de perfiles

│   ├── middleware/

│   │   └── authMiddleware.js    \# Validación JWT

│   ├── routes/

│   │   ├── auth.routes.js

│   │   ├── product.routes.js

│   │   ├── order.routes.js

│   │   └── profile.routes.js

│   ├── .env                     \# Variables de entorno (NO en repo)

│   └── server.js                \# Punto de entrada del servidor

│

└── frontend/

    ├── index.html               \# Página principal (catálogo)

    ├── login.html

    ├── register.html

    ├── profile.html

    ├── css/

    │   └── styles.css           \# CSS3 con variables de diseño

    └── js/

        ├── api-client.js        \# Módulo centralizado HTTP

        ├── cart.js              \# Lógica del carrito

        ├── catalog.js           \# Renderizado del catálogo

        └── auth.js              \# Gestión de sesión JWT

## **4.5 Motor de Auto-Provisioning**

El módulo config/init.js implementa una secuencia de inicialización idempotente que se ejecuta automáticamente al arrancar el servidor. El proceso sigue el siguiente algoritmo:

1. Verificar existencia de la base de datos esencia\_de\_luz. Si no existe, ejecutar CREATE DATABASE.

2. Verificar existencia de cada tabla requerida. Para cada tabla ausente, ejecutar el DDL de creación correspondiente.

3. Contar registros en la tabla products. Si el conteo es cero (base de datos vacía), ejecutar INSERT de datos semilla (seeding) con el inventario inicial de productos artesanales.

4. Verificar existencia de índices de rendimiento. Si no existen, crearlos (INDEX en category, INDEX en order\_id).

5. Registrar en log el resultado de la inicialización con timestamp y estado de cada operación.

# **5\. Stack Tecnológico y Justificación**

## **5.1 Inventario Tecnológico Completo**

| Tecnología | Versión | Capa | Rol en el Sistema |
| ----- | ----- | ----- | ----- |
| Node.js | 18 LTS+ | Backend | Entorno de ejecución JavaScript del lado del servidor. Provee el event loop no bloqueante que permite manejar múltiples conexiones concurrentes con bajo consumo de recursos. |
| Express.js | 4.x | Backend | Framework minimalista para Node.js. Gestiona el enrutamiento HTTP, la cadena de middleware y la respuesta a peticiones REST. Permite una arquitectura modular y extensible. |
| MySQL | 8.0+ | Base de Datos | Sistema de gestión de base de datos relacional (RDBMS). Provee soporte para transacciones ACID, integridad referencial mediante foreign keys, disparadores y procedimientos almacenados. |
| mysql2 | 3.x | Backend | Driver oficial Node.js para MySQL con soporte nativo de Promesas y prepared statements, previniendo inyección SQL. Provee el pool de conexiones. |
| jsonwebtoken | 9.x | Backend | Implementación del estándar JWT (RFC 7519\) para Node.js. Firma tokens con algoritmo HS256 o RS256 y verifica su integridad y expiración en cada petición autenticada. |
| bcryptjs | 2.x | Backend | Implementación JavaScript del algoritmo bcrypt. Aplica hashing unidireccional con sal aleatoria para almacenamiento seguro de contraseñas, resistente a ataques de fuerza bruta y rainbow tables. |
| dotenv | 16.x | Backend | Carga variables de entorno desde archivos .env al objeto process.env, permitiendo configuración externalizada y separación de secretos del código fuente. |
| cors | 2.x | Backend | Middleware Express para la configuración de políticas Cross-Origin Resource Sharing, controlando qué orígenes pueden realizar peticiones a la API. |
| HTML5 | Living Std. | Frontend | Lenguaje de marcado semántico para la estructura de las páginas web. El uso de elementos semánticos mejora la accesibilidad y el SEO. |
| CSS3 | Living Std. | Frontend | Hoja de estilos con variables CSS (custom properties), Flexbox, Grid Layout y animaciones para un diseño premium, responsive y performante sin dependencias externas. |
| JavaScript ES6+ | ES2022 | Frontend | Lenguaje de programación del cliente. Utiliza módulos nativos (import/export), async/await, Fetch API, destructuring y otras características modernas sin transpilación. |
| WhatsApp API | wa.me | Integración | Protocolo de enlace profundo de WhatsApp Business para la generación de mensajes pre-formateados de confirmación de pedido enviados al número de atención del negocio. |

## **5.2 Justificación de Decisiones Arquitectónicas**

### **5.2.1 Node.js \+ Express.js como Backend**

La elección de Node.js sobre alternativas como Python/Django o PHP/Laravel responde a tres factores determinantes: primero, el uso de JavaScript en ambas capas (frontend y backend) elimina el costo cognitivo de cambio de contexto para el equipo de desarrollo y permite compartir esquemas de validación. Segundo, el modelo de I/O no bloqueante de Node.js es especialmente eficiente para aplicaciones que realizan múltiples consultas de base de datos concurrentes, como un e-commerce bajo carga. Tercero, el ecosistema npm provee acceso inmediato a las librerías de seguridad y utilidad necesarias (jsonwebtoken, bcryptjs, mysql2).

### **5.2.2 MySQL como Motor de Base de Datos**

MySQL 8.0 fue seleccionado sobre alternativas NoSQL (MongoDB) y otros RDBMS (PostgreSQL) por las siguientes razones: la naturaleza relacional de los datos del e-commerce (usuarios, pedidos, ítems, productos) se mapea naturalmente a un modelo tabular con integridad referencial. Las transacciones ACID son fundamentales para garantizar la consistencia de los pedidos (si falla la inserción de un order\_item, el pedido completo debe revertirse). MySQL tiene un menor overhead operacional y es la opción más accesible en entornos de hosting compartido donde este tipo de proyectos suele desplegarse.

### **5.2.3 JWT para Gestión de Sesiones**

La autenticación basada en tokens JWT fue preferida sobre las sesiones tradicionales con cookies de servidor por su naturaleza stateless, que elimina la necesidad de almacenar estado de sesión en el servidor. Esto facilita la escalabilidad horizontal del backend (múltiples instancias del servidor pueden atender peticiones del mismo usuario sin compartir estado). El token contiene toda la información de identidad necesaria (userId, email) en su payload, firmado criptográficamente para garantizar su integridad.

### **5.2.4 JavaScript Vanilla sin Framework de Frontend**

La decisión de utilizar JavaScript Vanilla en lugar de frameworks como React, Vue o Angular responde al principio de simplicidad adecuada para el alcance del proyecto. Un e-commerce de catálogo estático con interacciones moderadas no justifica la complejidad de un framework SPA completo, el overhead de compilación, o la curva de aprendizaje adicional. Esta decisión reduce las dependencias, mejora el tiempo de carga inicial y facilita el mantenimiento por equipos con perfiles mixtos.

# **6\. Matriz de Trazabilidad de Requisitos**

La siguiente matriz relaciona cada requisito funcional con los componentes de implementación, las tecnologías involucradas y los criterios de aceptación correspondientes.

| ID | Requisito | Componentes | Tecnologías | Criterio de Aceptación |
| ----- | ----- | ----- | ----- | ----- |
| RF-01 | Registro de Usuario | authController.js, routes/auth, tabla users \+ profiles | Node, Express, bcryptjs, MySQL | Usuario registrado con hash en DB. HTTP 201\. JWT retornado. |
| RF-02 | Login | authController.js, authMiddleware.js | Node, Express, jsonwebtoken, bcryptjs | JWT válido retornado. HTTP 401 genérico ante fallo. |
| RF-03 | Catálogo de Productos | productController.js, catalog.js, tabla products | Node, Express, MySQL, JS ES6 | Array JSON completo. Filtro por categoría funcional. |
| RF-04 | Carrito Reactivo | cart.js (frontend) | JavaScript ES6+ Vanilla | Total actualizado \< 100ms. Estado correcto tras add/remove. |
| RF-05 | Creación de Pedido | orderController.js, tablas orders \+ order\_items | Node, Express, MySQL (transacciones) | Pedido en DB con HTTP 201\. ROLLBACK ante fallo parcial. |
| RF-06 | Confirmación WhatsApp | orderController.js (url builder) | WhatsApp wa.me API | URL correctamente formateada y URL-encoded generada. |
| RF-07 | Gestión de Perfil | profileController.js, tabla profiles | Node, Express, MySQL, JWT | Campos actualizados en DB. Solo usuario propietario puede editar. |
| RF-08 | Cliente API Centralizado | api-client.js (frontend) | JavaScript ES6+, Fetch API | 100% de llamadas HTTP canalizadas por este módulo. |
| RNF-01 | Seguridad de Contraseñas | authController.js, config/database.js | bcryptjs (saltRounds=10), JWT | 0% contraseñas en texto plano. Tiempo hashing \> 100ms. |
| RNF-02 | Rendimiento DB | config/database.js (pool), índices MySQL | MySQL 8.0, mysql2 pool | P95 \< 500ms en GET /api/products con 1000 productos. |

# **7\. Control de Versiones del Documento**

| Versión | Fecha | Autor | Descripción del Cambio | Estado |
| ----- | ----- | ----- | ----- | ----- |
| 1.0.0 | Marzo 2026 | Equipo de Arquitectura | Emisión inicial del documento SRS completo bajo estándar IEEE 830\. Incluye secciones 1 a 7, modelo ER, flujos de datos y matriz de trazabilidad. | Aprobado |

Este documento está sujeto a proceso formal de control de cambios. Cualquier modificación debe ser revisada y aprobada por el Arquitecto de Software responsable y debe generar una nueva entrada en la tabla de versiones anterior. Los cambios a requisitos funcionales clasificados como Alta prioridad requieren revisión de impacto sobre la arquitectura y aprobación del equipo de QA antes de su incorporación.

***— Fin del Documento —***

Esencia de Luz SRS v1.0.0  |  Confidencial  |  IEEE 830  |  Marzo 2026
