import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestGfxComponent } from './test-gfx.component';
import { TestCardComponent } from './testcard/testcard.component';
import { TestCardComponent2 } from './testcard2/testcard2.component';

@NgModule({
  declarations: [ 
    TestGfxComponent,
    TestCardComponent,
    TestCardComponent2
  ],
  exports: [RouterModule]
})
export class TestGfxModule { }