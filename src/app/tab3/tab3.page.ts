import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  result: any;
  resultInfo: Observable<any>[];
  temp: number = 0;
  constructor(private cryptoservice : CryptoService, private router: Router) {}

  ngOnInit() {
    this.getTop100();
    
  }

  getTop100(){    
    this.result = this.cryptoservice.getTop100().subscribe(
      data => { 
        this.result = data; 
        this.resultInfo = Array.of(this.result.Data);      
        console.log(this.resultInfo);
    },
    err => console.log(err),
     () =>console.log("data got"));
  }


  showInfo(coin){
    this.router.navigate(['/coininfo'], { state: { name: coin.CoinInfo.Name, fullName: coin.CoinInfo.FullName} })
  }

  cutString(coin){
    var splitted = coin.split(" ", 2); 
    return splitted[1];

  }

}
