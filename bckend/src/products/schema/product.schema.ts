import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Definimos un tipo `ProductDocument` que extiende de `Product` y `Document`
// Esto permite que Mongoose maneje correctamente los documentos de MongoDB
export type ProductDocument = Product & Document;

@Schema({
  timestamps: true, // Agrega automáticamente los campos `createdAt` y `updatedAt`
})
export class Product {

    @Prop({ required: true }) 

    @Prop() 
    description: string;

    @Prop({ required: true }) 
    price: number;

    @Prop({ type: [String], index: true }) // Solución: Añadir índice en `categories`
    categories: string[];

    @Prop({ required: true }) 
    stock: number;
}

// Creación del esquema basado en la clase `Product`
export const ProductSchema = SchemaFactory.createForClass(Product);


ProductSchema.index({ name: 'text', description: 'text' });