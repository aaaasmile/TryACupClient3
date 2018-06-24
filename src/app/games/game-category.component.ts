import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'game-category-list',
  templateUrl: 'game-category.component.html',
  styleUrls: ['game-category.component.css']
})

export class GameCategoryComponent implements OnInit {

  
  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
  }

  
}