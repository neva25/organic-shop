import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afs: Firestore) { }

  getAll() {
    return collectionData(
      query(
        collection(this.afs, 'categories') as CollectionReference<Category>,
        orderBy("name")
      ),
    );
  }

 
}
