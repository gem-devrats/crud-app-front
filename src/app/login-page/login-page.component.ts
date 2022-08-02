import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private router:Router) { }

  isPasswordCorrect:boolean = false;
  
  login = this.formBuilder.group({
    email:['',[this.validateEmail,Validators.required]],
    password:['',[Validators.required,this.validatePassword,Validators.minLength(8)]]
  });

  validateEmail(emails:any){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/.test(emails.value) ? null : emails;
  }

  validatePassword(password:any){
    return /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/.test(password.value) ? null : password;
  }

  signupNavigation(){
    this.router.navigate(['/signUp']);
  }

  logIn(){
    axios.post('http://localhost:3000/login', 
    {
      "email":this.login.value.email,
      "password":this.login.value.password
  })
    .then((response:any) =>{
      console.log(response.data.user.name);
      console.log(response.data.user.email);
      localStorage.setItem('jwt',response.data.jwt)
      localStorage.setItem('name',response.data.user.name)
      localStorage.setItem('email',response.data.user.email)
      this.router.navigate(['/dashboard']);
    })
    .catch((error:any) => {
      if(error.response.status==401){
        this.isPasswordCorrect = true
      }
      console.log(error);
    });
  }

  ngOnInit(): void {
  }

}
