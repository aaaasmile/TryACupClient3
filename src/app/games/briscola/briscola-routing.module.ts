import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BriscolaInDueComponent } from './briscola_in_due/briscola-in-due.component';
import { BriscolaCategoryComponent } from './briscola-category.component'

const routes: Routes = [
  { path: '', component: BriscolaCategoryComponent },
  { path: 'briscola-in-due', component: BriscolaInDueComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BriscolaRoutingModule { }