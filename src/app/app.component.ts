import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {

  name:string = localStorage.getItem('name') || '';
  email:string = localStorage.getItem('email') || '';

  constructor(private router:Router){}
  ngDoCheck(): void {
    this.name = localStorage.getItem('name') || '';
    this.email = localStorage.getItem('email') || '';
  }
  
  ngOnInit(): void {

  }


  logout(){
    axios.get('http://localhost:3000/logout')
    .then((response:any) =>{
      console.log(response);
      localStorage.removeItem('jwt')
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      this.router.navigate(['/login'])
    })
    .catch((error:any) => {
      console.log(error);
    });
  }


  title = 'crud-app';
}
