import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    // Mejora: Usa un mapa con timestamps
    /* Cada producto en caché ahora incluye un timestamp para registrar cuándo se guardó.
    Se define un tiempo de expiración (cacheExpiration) de 5 minutos. Si los datos son más viejos que esto, se vuelven a solicitar al servidor.*/
    private productCache = new Map<string, { product: Product; timestamp: number }>();
    private cacheExpiration = 5 * 60 * 1000; // 5 minutos

    constructor(private http: HttpClient) { }

    // Mejorada: Cache eficiente y evita recargar todos los productos
    /* Ahora se usa HttpParams para enviar page y limit, permitiendo descargar solo los productos necesarios.
Reduce la carga del servidor y mejora la velocidad de respuesta*/
    getAllProducts(page: number = 1, limit: number = 10): Observable<{ products: Product[], totalCount: number }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<{ products: Product[], totalCount: number }>(this.apiUrl, { params }); // Asegúrate de que la respuesta sea de este tipo
    }

    // Optimizado: Añadir caching con timestamp
    /*Antes de hacer una petición HTTP, se revisa si:
    El producto está en caché (cachedEntry).
    El caché no ha expirado (now - cachedEntry.timestamp < this.cacheExpiration).
    Si el caché es válido, se devuelve el producto con of(cachedEntry.product), evitando una solicitud HTTP innecesaria.
    Si el caché expiró o no existe, se hace una solicitud HTTP y se guarda en caché con tap(). */
    getProduct(id: string): Observable<Product> {
        const cachedEntry = this.productCache.get(id);
        const now = Date.now();

        if (cachedEntry && now - cachedEntry.timestamp < this.cacheExpiration) {
            return of(cachedEntry.product);
        }

        return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
            tap(product => this.productCache.set(id, { product, timestamp: now }))
        );
    }

    // Mejorada: Agregar  paginación con HttpParams
    searchProducts(term: string, page: number = 1, limit: number = 10): Observable<{ products: Product[], totalCount: number }> {
        const params = new HttpParams()
            .set('term', term.trim()) // Asegúrate de recortar los espacios en blanco
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<{ products: Product[], totalCount: number }>(`${this.apiUrl}/search`, { params });
    }

    findById(id: string): Observable<Product | null> {
        return this.http.get<Product | null>(`${this.apiUrl}/${id}`);
    }
}
