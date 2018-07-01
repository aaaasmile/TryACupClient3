import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root', // singleton service
})
export class OnlineService implements CanActivate {
  private _isOnline: boolean;

  constructor() {
    let mode_str: string = localStorage.getItem('onlineMode');
    console.log('Online mode is ', mode_str);
    if (mode_str != null) {
      this._isOnline = JSON.parse(mode_str);
    } else {
      this._isOnline = true;
    }

  }

  canActivate() {
    return this._isOnline;
  }

  goOffline(): void {
    this._isOnline = false;
    this.persistOnline();
  }

  goOnline(): void {
    this._isOnline = true;
    this.persistOnline();
  }

  private persistOnline(): void {
    localStorage.setItem('onlineMode', JSON.stringify(this._isOnline));
    console.log('Online is ', this._isOnline);
  }

  isOnline(): boolean {
    return this._isOnline;
  }

}
