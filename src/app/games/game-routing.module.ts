import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameCategoryComponent } from './game-category.component'


@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: GameCategoryComponent},
      { path: 'briscola', loadChildren: 'app/games/briscola/briscola.module#BriscolaModule'},
      { path: 'test-gfx', loadChildren: 'app/games/test-gfx/test-gfx.module#TestGfxModule'}
    ])
  ],
  exports: [RouterModule]
})
export class GameRoutingModule {}
