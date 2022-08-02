import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }
  token:string = '';
  userName:string= ''
  userEmail:string=''
}
