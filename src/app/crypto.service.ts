import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  url = "https://min-api.cryptocompare.com/data/";
  apiKey = "e057c303fa16a0bcbc33cedd2815ee2f54893a43b66a4dc46bb2e1a2a6fec0f7";
  constructor(private http : HttpClient) { }

  searchCrypto(name: string) {
    let data = this.http.get(`${this.url}pricemultifull?fsyms=${name}&tsyms=CAD&api_key=${this.apiKey}`);
    return data;
  }


  getCryptoPrice(name: string){
    let data = this.http.get(`${this.url}price?fsym=${name}&tsyms=CAD&api_key=${this.apiKey}`);
    return data;
  }

  getTop100(){
    let data = this.http.get(`${this.url}top/totalvolfull?limit=25&tsym=CAD&api_key=${this.apiKey}`)
    return data;
  }

  //use for 1 hour, 1day (limit 2000)
  getByMinute(name: string){
    let data = this.http.get(`${this.url}histominute?fsym=${name}&tsym=CAD&limit=1440&api_key=${this.apiKey}`);
    return data;
  }

  //use for 5 days, 1 month
  getByHour(name: string){
    let data = this.http.get(`${this.url}histohour?fsym=${name}&tsym=CAD&limit=730&api_key=${this.apiKey}`);
    return data;
  }

  //use for 6 months and 1 year
  getByDay(name: string){
    let data = this.http.get(`${this.url}histoday?fsym=${name}&tsym=CAD&limit=365&api_key=${this.apiKey}`);
    return data;
  }

}
