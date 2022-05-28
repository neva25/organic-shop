import { Injectable } from '@angular/core';
import { Firestore, setDoc, doc, docData } from '@angular/fire/firestore'
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: Firestore) { }

  async save(user: User) {
    const data = { 
      email: user.email, 
      name: user.displayName,
      isAdmin: false
    }
    await setDoc(doc(this.afs, 'users', user.uid), data);
  }

  get(uid: string): Observable<Profile> {
    return <Observable<Profile>>docData(doc(this.afs, 'users', uid));
  }
}
