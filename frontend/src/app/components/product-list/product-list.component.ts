import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="search-container">
      <input 
        type="text" 
        [(ngModel)]="searchTerm" 
        (input)="onSearch()"
        placeholder="Search by name or ID"
        class="search-input"
      />
    </div>

    <div class="products-grid">
      <div *ngFor="let product of products" class="product-card">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <span class="product-price">{{ product.price | currency }}</span>
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination">
      <button (click)="previousPage()" [disabled]="currentPage <= 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button (click)="nextPage()" [disabled]="currentPage >= totalPages">Next</button>
    </div>
  `,
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  searchTerm: string = '';
  category: string = '';  
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  private searchSubject = new Subject<string>(); // Subject para manejar la búsqueda

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchTerm = params['term'] || '';
      this.currentPage = +params['page'] || 1;
      this.itemsPerPage = +params['limit'] || 10;

      this.loadProducts(); // Cargar productos al iniciar el componente
    });

    // Configurar debounce en la búsqueda
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de la última entrada del usuario
      distinctUntilChanged(), // Evita hacer la búsqueda si el valor no cambia
      switchMap(searchTerm => {
        // Si no hay término de búsqueda, carga todos los productos
        if (! searchTerm.trim()) {
          return this.productService.getAllProducts(this.currentPage, this.itemsPerPage);
        }
        // Si hay término de búsqueda, busca los productos que coincidan
        return this.productService.searchProducts(searchTerm, this.currentPage, this.itemsPerPage);
      })
    ).subscribe(response => {
      this.products = response.products;  // Acceder a los productos
      this.totalItems = response.totalCount; 
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); 
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete(); // Cierra el Subject cuando el componente se destruye
  }

  // Método para buscar 
  onSearch() {
    this.searchSubject.next(this.searchTerm); // Envía el término de búsqueda al Subject
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { term: this.searchTerm, page: 1, limit: this.itemsPerPage }, // Actualiza la URL
      queryParamsHandling: 'merge' // Mantén los parámetros existentes
    });
  }

  // Método para cargar productos
  loadProducts() {
    this.productService.getAllProducts(this.currentPage, this.itemsPerPage).subscribe(response => {
      this.products = response.products;  // Acceder a los productos
      this.totalItems = response.totalCount; 
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    });
  }

  // Método para avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge'
      });
      this.loadProducts();
    }
  }

  // Método para retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge'
      });
      this.loadProducts();
    }
  }
}
