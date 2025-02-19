import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Para capturar parámetros de la URL
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;  // Inicializa como null en caso de que no se encuentre el producto
  errorMessage: string = ''; 

  constructor(
    private route: ActivatedRoute,  // Para acceder al parámetro 'id' de la URL
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');  // Captura el id desde la URL
    console.log(`Product ID from URL: ${productId}`);
    if (productId) {
      this.getProduct(productId);
    }
  }

  // Método para obtener el producto
  getProduct(id: string): void {
    this.productService.findById(id).subscribe(
      (product) => {
        console.log('Product data:', product);  // Verifica los datos obtenidos
        this.product = product;  // Si el producto es encontrado, lo asigna a la propiedad
        this.errorMessage = '';   // Limpia el mensaje de error
      },
      (error) => {
        console.error('Error fetching product:', error);
        this.product = null;      // Si ocurre un error (producto no encontrado), se pone como null
        this.errorMessage = `Producto con ID ${id} no encontrado.`;  // Muestra el mensaje de error
      }
    );
  }
}
