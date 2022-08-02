import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private router:Router) { }

  emailAlreadyRegistered:boolean = false
  
  signup:any = this.formBuilder.group({
    name:['',[Validators.required]],
    email:['',[this.validateEmail,Validators.required]],
    password:['',[Validators.required,this.validatePassword,Validators.minLength(8)]],
    confirmPassword:['',[Validators.required,Validators.minLength(8),this.validateConfirmPassword]]
  });

  validateEmail(emails:any){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/.test(emails.value) ? null : emails;
  }

  validatePassword(password:any){
    localStorage.setItem('confirmPassword',password.value);
    return /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/.test(password.value) ? null : password;
  }

  validateConfirmPassword(password:any){
    let confirmPassword = localStorage.getItem('confirmPassword');

    return  password.value=== confirmPassword ? null : password;
  }

  signUp(){
    axios.post('http://localhost:3000/signup', 
    {
      "name":this.signup.value.name,
      "email":this.signup.value.email,
      "password":this.signup.value.password
  })
    .then((response:any) =>{
      console.log(response);
      this.router.navigate(['/login']);
    })
    .catch((error:any) => {
      if(error.response.status==409){
        this.emailAlreadyRegistered = true;
      }
      console.log(error);
    });
  }

  loginNavigation(){
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }

}
