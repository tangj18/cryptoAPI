import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoService } from '../crypto.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isLoading = false;
  result: any;
  resultPrice: any;
  coin = {
    name: ''
  }

  constructor(private cryptoservice : CryptoService, public router: Router) {}

  ngOnInit() {
  }

  
  async searchCrypto(form){
    
    console.log(form.value.name);
    let tempString = form.value.name.toUpperCase();
    this.isLoading = true;
    this.result = this.cryptoservice.searchCrypto(tempString).subscribe(
      data => { 
        this.result = data; 
        this.result = Array.of(this.result.DISPLAY[tempString].CAD);
        console.log(this.result);
    },
    err =>{
      console.log(err);
    },
     () => this.router.navigate(['/coininfo'], { state: { name: form.value.name.toUpperCase()} }))

     this.getPrice(form.value.name);
    this.isLoading = false;
  }

  getPrice(value){
    let tempString = value.toUpperCase();
    
    this.resultPrice = this.cryptoservice.getCryptoPrice(tempString).subscribe(
      data=> {
        this.resultPrice = data;
        console.log(this.resultPrice);
      },
      err => console.log(err),
      () =>console.log("data got"));
     
    
  }
}
