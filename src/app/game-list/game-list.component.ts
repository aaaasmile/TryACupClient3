import { Component, OnInit } from '@angular/core';
import { CardGameService } from '../services/cardGame.service'
@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html'
})
export class GameListComponent implements OnInit {

  constructor(private cardGameService: CardGameService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cardGameService.reqGameList();
    console.log('Request table list')
  }

}
