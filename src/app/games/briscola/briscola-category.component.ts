import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'briscola-category-list',
  templateUrl: 'briscola-category.component.html',
  styleUrls: ['briscola-category.component.css']
})

export class BriscolaCategoryComponent implements OnInit {

  
  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
  }

  
}