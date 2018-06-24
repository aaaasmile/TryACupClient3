import { Injectable } from '@angular/core';
import { USERS } from './mock-users';
import { User } from '../data-models/user';

@Injectable()
export class UserService {
  getUsers(): Promise<User[]> {
    return Promise.resolve(USERS);
  }
  getUsersSlowly(): Promise<User[]> {
    return new Promise<User[]>(resolve =>
      setTimeout(resolve, 2000)) // delay 2 seconds
      .then(() => this.getUsers());
  }
  getHero(id: number): Promise<User> {
    return this.getUsers()
              .then(users => users.find(user => user.id === id));
  }

}