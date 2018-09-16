import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root', // singleton service
})
export class OnlineModeService implements CanActivate {
  private _onlineMode: string; //online/offline

  constructor() {
    let mode_str: string = localStorage.getItem('onlineMode');
    console.log('Online mode is ', mode_str);
    if (mode_str != null) {
      this._onlineMode = JSON.parse(mode_str);
    } else {
      this._onlineMode = 'online';
    }

  }

  canActivate() {
    return this._onlineMode === 'online';
  }

  goOffline(): void {
    this._onlineMode = 'offline';
    this.persistOnline();
  }

  goOnline(): void {
    this._onlineMode = 'online';
    this.persistOnline();
  }

  private persistOnline(): void {
    localStorage.setItem('onlineMode', JSON.stringify(this._onlineMode));
    console.log('online mode is now', this._onlineMode);
  }

  isModeOnline(): boolean {
    return this._onlineMode === 'online';
  }

}
