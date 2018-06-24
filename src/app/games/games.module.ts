import { NgModule } from '@angular/core';
import { GameRoutingModule } from './game-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { GameCategoryComponent } from './game-category.component'


@NgModule({
  imports: [GameRoutingModule],
  declarations: [ 
    GameCategoryComponent,
  ],
  exports: [RouterModule]
})
export class GamesModule { }
