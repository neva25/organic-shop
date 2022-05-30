import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, addDoc, doc, docData, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afs: Firestore) { }

  create(product: Product) {
    return setDoc(doc(collection(this.afs, 'products')), product);
  }

  getProducts(search: string): Observable<Product[]> {
    if (search) {
      const endcode = search.slice(0, -1) + String.fromCharCode(search.charCodeAt(search.length-1) + 1);

      return collectionData(
        query(
          collection(this.afs, 'products'),
          where('title', '>=', search),
          where('title', '<', endcode)
        ), { idField: 'id' }
      )
    } else {
      return collectionData(collection(this.afs, 'products'), { idField: 'id' });
    }
  }

  get(id: string): Observable<Product> {
    return docData(doc(this.afs, `products/${id}`), { idField: 'id' });  
  }

  getAll(): Observable<Product[]> {
    return collectionData(collection(this.afs, 'products'), { idField: 'id' });
  } 

  update(product: Product) {
    return setDoc(doc(this.afs, `products/${product.id}`), product);
  }

  delete(id: string) {
    console.log(id)
    const ref = doc(this.afs, 'products', id)
    docData(ref).subscribe(r => console.log(r))
    return deleteDoc(doc(this.afs, 'products', id));
  }

}
