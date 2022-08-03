import { Component, DoCheck, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  contactId: string = '';
  contactEmail: string = ''
  contactData: any[] = [];
  config = {
    headers: {
      token: localStorage.getItem('jwt') || '',
    }
  };

  edit: any = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [this.validateEmail, Validators.required]],
    mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]]
  });

  validateEmail(emails: any) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/.test(emails.value) ? null : emails;
  }

  mail: any = this.formBuilder.group({
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]]
  });

  genrateContactId(item: string) {
    this.contactId = item
  }

  genrateEmail(item: string) {
    console.log(item)
    this.contactEmail = item
  }

  createConatct() {
    console.log('creating contact')
    const data = {
      name: this.edit.value.name,
      email: this.edit.value.email,
      mobile: this.edit.value.mobile
    }
    this.contactData.push(data);
    axios.post('http://localhost:3000/dashboard', {
      name: this.edit.value.name,
      email: this.edit.value.email,
      mobile: this.edit.value.mobile
    }, this.config)
      .then((response: any) => {
        console.log(response);
        this.edit.reset
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  deleteContact(item: string) {
    console.log(item)
    var index = 0;
    for (var i = 0; i < this.contactData.length; i++) {
      if (this.contactData[i]._id == item) {
        index = i;
      }
    }
    this.contactData.splice(index, 1)
    axios.delete('http://localhost:3000/dashboard/' + item, this.config)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  updateContact() {
    console.log(this.contactId)
    var index = 0;
    for (var i = 0; i < this.contactData.length; i++) {
      if (this.contactData[i]._id == this.contactId) {
        index = i;
      }
    }
    this.contactData[index].name = this.edit.value.name
    this.contactData[index].email = this.edit.value.email
    this.contactData[index].mobile = this.edit.value.mobile
    axios.put('http://localhost:3000/dashboard/' + this.contactId, {
      name: this.edit.value.name,
      email: this.edit.value.email,
      mobile: this.edit.value.mobile
    }, this.config)
      .then((response: any) => {
        console.log(response);
        this.edit.reset
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  sendMail() {
    console.log(this.contactEmail)
    console.log(this.mail.value.message)
    console.log(this.mail.value.subject)
    axios.post('http://localhost:3000/sendmail', {
      to: this.contactEmail,
      subject: this.mail.value.subject,
      message: this.mail.value.message
    }, this.config)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  getSheet() {
    axios.get('http://localhost:3000/sheet', this.config)
      .then((response: any) => {
        console.log(response);
        let byteCharacters = atob(response.data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          let slice = byteCharacters.slice(offset, offset + 512);

          let byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const url = window.URL.createObjectURL(new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contact');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    axios.get('http://localhost:3000/dashboard', this.config)
      .then((response: any) => {
        console.log(response.data);
        this.contactData = response.data
      })
      .catch((error: any) => {
        if (error.response.status == 402) {
          this.router.navigate(['/login']);
        }
        console.log(error);
      });
  }

}
