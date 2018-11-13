import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'my-test-gfx',
  templateUrl: 'test-gfx.component.html'
})

export class TestGfxComponent implements OnInit {
  private mainStage: createjs.Stage;
  private imgTmp;

  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
    console.log('test-gfx initialization');
  }
}