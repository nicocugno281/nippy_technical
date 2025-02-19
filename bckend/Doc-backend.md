# 🚨Problemas y limitaciones del código original

**1. Falta de índices en la base de datos:**
    - No se han definido índices en los campos clave como name, description y categories. Esto afecta la eficiencia de las búsquedas, especialmente cuando la colección crece.

    - 🔧 Solución: Agregar un índice de texto (text index) para permitir búsquedas eficientes en name y description.

**1. Falta de validaciones en los campos:**
    - categories: No hay restricciones sobre los valores dentro del array.
    
    - description: No es obligatorio, lo que puede generar productos sin descripción.

    - 🔧 Solución: Agregar restricciones y validaciones para mejorar la integridad de los datos.

# 🚀 Mejoras implementadas

## 📌 1. Optimización de búsqueda

**Antes:**
    - No se podían hacer búsquedas eficientes por name y description.

**Después:**
    -  Se ha agregado un índice de texto con ProductSchema.index({ name: 'text', description: 'text' }). Ahora, las consultas como find({ $text: { $search: "laptop" } }) serán mucho más rápidas.

## 📌 2. Índices en campos clave
    - Se ha agregado index: true en name y categories para mejorar la velocidad de búsqueda y filtrado.


# 🛠️ Cómo usar este esquema en la API

## Crear un producto
    - Para agregar un nuevo producto a la base de datos, se debe enviar un POST con el siguiente formato:

```json
    {//POST /products
        "name": "Laptop Dell XPS 15",
        "description": "Una laptop potente para desarrolladores",
        "price": 1500,
        "categories": ["Laptops", "Electrónica"],
        "stock": 20
    }
```
**Respuesta esperada**

```json
    {
        "_id": "65abcd123efg456hijk",
        "name": "Laptop Dell XPS 15",
        "description": "Una laptop potente para desarrolladores",
        "price": 1500,
        "categories": ["Laptops", "Electrónica"],
        "stock": 20,
        "createdAt": "2024-02-18T12:00:00.000Z",
        "updatedAt": "2024-02-18T12:00:00.000Z"
    }
```

## 🎯 Conclusión

    - Se han optimizado las búsquedas con un índice de texto en name y description.
    - Ahora la API es más rápida y escalable, incluso con grandes volúmenes de datos.
    - Se ha agregado un índice en categories para poder luego escalar el producto y filtrar por categorias.


# Servicio de Productos en NestJS con Mongoose
    - Este archivo define el servicio ProductsService, que interactúa con la base de datos MongoDB utilizando Mongoose en un proyecto basado en NestJS.

## 🚨 Problemas y limitaciones del código original

### 1️⃣ Falta de paginación en findAll()
    - Problema: findAll() devuelve todos los productos de la base de datos sin ninguna restricción.

    - Cuello de botella: A medida que la colección crezca, la respuesta será más grande y más lenta.

    - Solución aplicada: Se agregó paginación, permitiendo obtener productos en lotes.

### 2️⃣ Búsqueda ineficiente en search()
    - Problema: La búsqueda usa $regex, que es lento e ineficiente en grandes volúmenes de datos.

    - Cuello de botella: Sin índices, la base de datos debe recorrer todos los documentos para encontrar coincidencias.

    - Solución aplicada: Se reemplazó $regex por índices de texto ($text: { $search: term }), lo que mejora el rendimiento.

### 3️⃣ Manejo de errores en findOne()
    - Problema: Si un producto no existe, el servicio devuelve null, sin un mensaje claro.

    - Cuello de botella: Puede generar errores inesperados en el frontend.

    - Solución aplicada: Ahora, si un producto no se encuentra, devuelve un mensaje informativo.

### 5️⃣ No se podía crear productos desde el servicio
    - Problema: No existía un método para insertar nuevos productos en la base de datos.

    - Solución aplicada: Se agregó create(), que permite agregar productos.


# Como usar la API

## Obtener todos los productos con paginación

**Petición GET /products?page=2&limit=5**

```json
    {
        "page": 2,
        "limit": 5
    }   
```
**📥 Respuesta esperada**


```json
    {
        "products": [
            { "_id": "123", "name": "Producto 6", "price": 25 },
            { "_id": "124", "name": "Producto 7", "price": 30 }
        ],
        "totalCount": 20
    }
```
## Buscar productos por nombre o descripción

**📤 Petición GET /products/search?query=monitor&page=1&limit=5**

```json
    {
        "query": "monitor"
    }
```
**📥 Respuesta esperada**
```json
    {
        "products": [
            { "_id": "101", "name": "Monitor 24'' Samsung", "price": 150 },
            { "_id": "102", "name": "Monitor 27'' LG", "price": 180 }
        ],
        "totalCount": 10
    }
```
## Obtener un producto por su ID

**📤 Petición GET /products/65abcd123efg456hijk**

**📥 Respuesta esperada(Producto encontrado)**

```json
    {
        "_id": "65abcd123efg456hijk",
        "name": "Laptop Dell XPS 15",
        "price": 1500
    }
```
**📥 Respuesta esperada(Producto no encontrado)**

```json
    {
        "message": "Producto con ID 65abcd123efg456hijk no encontrado."
    }
```

## Crear un nuevo producto

**📤 Petición POST /products**

```json
    {
        "name": "Mouse Logitech MX Master 3",
        "description": "Mouse inalámbrico para productividad",
        "price": 100,
        "categories": ["Accesorios", "Periféricos"],
        "stock": 50 
    }       
```
**📥 Respuesta esperada**

```json
    {
        "message": "Producto creado exitosamente",
        "product": {
            "_id": "65lmnop456qrs789tuv",
            "name": "Mouse Logitech MX Master 3",
            "price": 100
        }
    }     
```

## Eliminar un producto

**📤 Eliminar un producto**

```json
    {
        "message": "Producto eliminado correctamente"
    } 
```


## Filtrar productos por categoría

**📤 Petición GET /products?category=Laptops**

```json
    {
        "category": "Laptops"
    }   
```

**📥 Respuesta esperada**

```json
    [
        {
            "_id": "65abcd123efg456hijk",
            "name": "Laptop Dell XPS 15",
            "description": "Una laptop potente para desarrolladores",
            "price": 1500,
            "categories": ["Laptops", "Electrónica"],
            "stock": 20
        }
    ]
```


# 🎯 Conclusión

    - Se agregaron paginación y filtros para mejorar la eficiencia en grandes volúmenes de datos.
    
    - La búsqueda ahora es más rápida gracias a los índices de texto en MongoDB.

    - Se agregaron validaciones y manejo de errores para mejorar la experiencia del usuario.

    - Se incluyó un método para crear productos, permitiendo interactuar con la base de datos.
    
    - Con estas mejoras, la API ahora es más escalable, eficiente y fácil de consumir. 🚀

