import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from './schema/product.schema';

@Controller('products') // Ruta base
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async findAll(@Query('page') page = '1', @Query('limit') limit = '10'): Promise<{ products: Product[], totalCount: number }> {
        const { products, totalCount } = await this.productsService.findAll(parseInt(page), parseInt(limit));
        return { products, totalCount };  // Devuelve tanto los productos como el total de productos
    }

    @Get('search')
    search(@Query('term') term: string, @Query('page') page = '1', @Query('limit') limit = '10') {
        return this.productsService.search(term, parseInt(page), parseInt(limit));
}

    @Get(':id') // Endpoint para obtener un producto por su ID
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    //Buscar por categoria especifica
    @Get('category')
    async findByCategory(@Query('category') category: string): Promise<Product[]> {

    return this.productsService.findByCategory(category);
}

    @Post() // Endpoint para crear un nuevo producto
    create(@Body() productData: Partial<Product>) {
        return this.productsService.create(productData);
    }
}