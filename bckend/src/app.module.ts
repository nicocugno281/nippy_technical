import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';  

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),  
    ProductsModule,  
  ],
})
export class AppModule {}