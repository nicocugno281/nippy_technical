import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './product.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schema/product.schema'; // Asegúrate de que la importación sea correcta

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
})
export class ProductsModule {}
