import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestGfxComponent } from './test-gfx.component';
import { TestCardComponent } from './testcard/testcard.component';
import { TestCardComponent2 } from './testcard2/testcard2.component';

const routes: Routes = [
  { path: '', component: TestGfxComponent },
  { path: 'testcard', component: TestCardComponent },
  { path: 'testcard2', component: TestCardComponent2 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestGfxRoutingModule { }