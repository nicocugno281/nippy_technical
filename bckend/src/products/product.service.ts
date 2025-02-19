import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async findAll(page: number = 1, limit: number = 10): Promise<{ products: Product[], totalCount: number }> {
        const totalCount = await this.productModel.countDocuments().exec(); // Cuenta todos los productos
        const products = await this.productModel.find()
            .skip((page - 1) * limit)  // Paginación: omitir productos según la página
            .limit(limit)              // Limitar la cantidad de productos por página
            .exec();
    
        return { products, totalCount }; 
    }
    


    async search(term: string, page: number = 1, limit: number = 10): Promise<{ products: Product[], totalCount: number }> {
        if (!term.trim()) {
            // Si no hay término de búsqueda, devuelve todos los productos
            const totalCount = await this.productModel.countDocuments().exec();
            const products = await this.productModel.find().skip((page - 1) * limit).limit(limit).exec();
            return { products, totalCount };
        }
    
        // Si hay término de búsqueda, realiza la búsqueda
        const products = await this.productModel.find(
            { $text: { $search: term } }, 
            { score: { $meta: 'textScore' } } // Obtiene la relevancia de la búsqueda
        )
        .sort({ score: { $meta: 'textScore' } }) // Ordena por relevancia
        .skip((page - 1) * limit) 
        .limit(limit) 
        .exec();
    
        const totalCount = await this.productModel.countDocuments({ $text: { $search: term } }).exec();
    
        return { products, totalCount };
    }

    //Se agrega la opcion de aceptar un null como retorno
    async findOne(id: string): Promise<Product | string> {
        try {
            const product = await this.productModel.findById(id).exec();
            if (!product) {
                return `Producto con ID ${id} no encontrado.`;
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    }

    /*async findByCategory(category: string): Promise<Product[]> {
        return this.productModel.find({
            categories: { $in: [category] }  // Usa $in para verificar si la categoría está en el array
        }).exec();
    }*/


    async create(productData: Partial<Product>): Promise<ProductDocument> {
        const createdProduct = new this.productModel(productData);
        return createdProduct.save();
    }
}