import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, DocumentData, DocumentReference, query, setDoc, getDoc, collectionGroup, onSnapshot } from '@angular/fire/firestore';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private afs: Firestore) { }

  private create() {
    return addDoc(collection(this.afs, 'shopping-carts'), {
      dateCreated: new Date().getTime()
    });
  }

  getItems(callback: any) {
    return onSnapshot(query(collectionGroup(this.afs, 'items')), callback);
  }

  private getItem(cartId: string, productId: string): DocumentReference<DocumentData> {
    return doc(this.afs, `shopping-carts/${cartId}/items/${productId}`);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId
    
    let result = await this.create();
    localStorage.setItem('cartId', result.id);
    return result.id;
  }

  addToCart(product: Product) {
    this.updateItemQuantity(product, 1)
  }

  removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1)
  }

  async updateItemQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let itemRef = this.getItem(cartId, product.id!);
    const docSnap = await getDoc(itemRef);
    setDoc(itemRef, {
      product: product,
      quantity: (docSnap.data()!['quantity'] || 0) + change
    });
  }
}
