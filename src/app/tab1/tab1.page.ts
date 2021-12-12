import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { CryptodatabaseService } from '../cryptodatabase.service';
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private db: CryptodatabaseService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private cryptoservice : CryptoService,
    private router: Router
  ) { }

  coinPrice: number;
  result: any;
  mainForm: FormGroup;
  Data: any[] = [];
  foundCoin: any;

  ngAfterViewInit(){
    
  }

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchCoins().subscribe(item => {
          this.Data = item;
        })
      }
    });
  
    this.mainForm = this.formBuilder.group({
      coinName: [''],
      coinCoin: [''],
      coinPrice: ['']
    })

    setInterval(() => { 
      this.updatePrice(); // Now the "this" still references the component
   }, 5000);

  }

  storeData() {
    this.db.addCoin(
      this.mainForm.value.coinName,
      this.mainForm.value.coinCoin,
      this.mainForm.value.coinPrice,
    ).then((res) => {
      this.mainForm.reset();
    })
  }

  deleteSong(id){
    this.db.deleteCoin(id).then(async(res) => {
      let toast = await this.toast.create({
        message: 'Coin deleted',
        duration: 2500
      });
      toast.present();      
    })
  }

  updatePrice(){
    for(let i = 0; i < this.Data.length; i++){
      console.log(this.Data[i].id);
      this.result = this.cryptoservice.getCryptoPrice(this.Data[i].cCoin).subscribe(
        data => { 
          this.result = data; 
          this.db.updateCoin(this.Data[i].id, this.result.CAD).then(()=>{
            console.log("updated");
          });
      },err => console.log(err));
   }
  }

  getPrice(coin){    
    this.result = this.cryptoservice.getCryptoPrice(coin).subscribe(
      data => { 
        this.result = data; 
        this.coinPrice = this.result.CAD
    },
    err => console.log(err),
     () =>console.log("data got"));
  }

  showCoin(coinName, coinFullname){
    this.router.navigate(['/coininfo'], { state: { name: coinName, fullName: coinFullname} })
  }

}
