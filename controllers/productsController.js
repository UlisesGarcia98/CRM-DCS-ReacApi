
const products = require('../models/productos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');



// Configuración de Multer
const multerConfiguration = {
    storage: multer.diskStorage({// Configuración del almacenamiento de archivos
        destination: (req, file, cb) => {// Función para definir el destino del archivo
            const uploadPath = path.join(__dirname, '../uploads'); // Construir la ruta del directorio donde se almacenarán las imágenes
            //console.log('Upload Path:', uploadPath); // Verifica la ruta aquí
            cb(null, uploadPath); // Proporciona la ruta de destino al callback
        },
        // Función para definir el nombre del archivo
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]; // Extraer la extensión del archivo desde el tipo MIME
            const fileName = `${shortid.generate()}.${extension}`; // Construir el nombre del archivo usando un ID único y el nombre original
            //console.log('Generated File Name:', fileName); // Verifica el nombre del archivo aquí
            cb(null, fileName); // Proporciona el nombre del archivo al callback
        }
    }),
    // Filtro para aceptar solo imágenes
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Definir tipos de archivos permitidos (imágenes en este caso)
        const mimetype = filetypes.test(file.mimetype); // Verificar si el tipo MIME del archivo coincide con los tipos permitidos
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Verificar si la extensión del archivo coincide con los tipos permitidos
  
        if (mimetype && extname) {
            return cb(null, true); // Permitir la carga del archivo si cumple con las condiciones
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes.'), false); // Rechazar el archivo si no cumple con las condiciones
        }
    },
    limits: { fileSize: 1000000 } // Tamaño máximo de archivo en bytes // Opcional: Límite de tamaño de archivo (1MB en este caso)
  };
  
  // Crear el middleware de Multer con la configuración definida
  const upload = multer(multerConfiguration).single('products_strImage');


exports.uploadArchive = async (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            console.error(error);
            return res.status(400).json({ message: 'Error al cargar el archivo', error: error.message });
        }
        // Llamar a next() para continuar al siguiente middleware
        next();
    });
};



exports.addProduct = async (req, res, next) => {
    const product = new products(req.body);
    try {
        // Verifica si req.file y req.file.filename existen
        if (req.file && req.file.filename) {
            product.products_strImage = req.file.filename;
        }

        const result = await product.save();
        res.status(201).json({ message: 'Producto creado correctamente', product: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al crear el producto', error: error.message });
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const product = await products.find({});
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
        next(error);
    }    
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener el producto', error: error.message });
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        // Busca el producto en la base de datos
        let product = await products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualiza el campo de imagen si existe un nuevo archivo
        if (req.file && req.file.filename) {
            product.products_strImage = req.file.filename;
        }

        // Actualiza otros campos desde `req.body`
        product = await products.findByIdAndUpdate(
            req.params.id,
            { ...req.body, products_strImage: product.products_strImage }, // Asegura que incluimos la imagen
            { new: true }
        );

        res.status(200).json({ message: 'Producto actualizado correctamente', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al actualizar el producto', error: err.message });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        // Busca el producto en la base de datos
        const product = await products.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Producto eliminado correctamente'});

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al buscar el producto', error: err.message });
        next(err);
    }
}

exports.getProductByName = async (req, res, next) => {
    try {
        const { name } = req.params;  // Obtiene el nombre del producto desde los parámetros de la URL

        // Realiza la búsqueda en el campo products_strName utilizando $regex
        const productsFind = await products.find({
            products_strName: { $regex: name, $options: 'i' } // Búsqueda insensible a mayúsculas/minúsculas
        });

        // Si no se encuentran productos, devuelve un 404
        if (productsFind.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        // Devuelve los productos encontrados
        res.json(productsFind);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener los productos', error: error.message });
        next(error);
    }
}
