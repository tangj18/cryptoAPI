import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Crypto } from './crypto';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class CryptodatabaseService {
  private storage: SQLiteObject;
  cryptoList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpclient: HttpClient,
    private sqlporter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
     this.createDBAndTables();
    });
  }

    private createDBAndTables() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.storage = db;
      this.storage.executeSql(`CREATE TABLE IF NOT EXISTS cointable(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cName TEXT UNIQUE, 
        cCoin TEXT,
        cPrice NUMBER
    )`, []).then(() => {
        this.getCoins();
        this.isDbReady.next(true);
      })
      .catch(e => console.log(e));

    }).catch(e => console.log(e));
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchCoins(): Observable<Crypto[]> {
    return this.cryptoList.asObservable();
  }


  getCoins(){
    return this.storage.executeSql('SELECT * FROM cointable', []).then(res => {
      let items: Crypto[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            id: res.rows.item(i).id,
            cName: res.rows.item(i).cName,  
            cCoin: res.rows.item(i).cCoin, 
            cPrice: res.rows.item(i).cPrice, 
           });
        }
      }
      this.cryptoList.next(items);
    });
  }

  addCoin(coin_name, coin_coin, coin_price) {
    let data = [coin_name, coin_coin, coin_price];
    return this.storage.executeSql('INSERT INTO cointable (cName, cCoin, cPrice) VALUES (?, ?, ?)', data)
    .then(res => {
      this.getCoins();
    });
  }


  getCoin(coin) {
    console.log("running this");
    return this.storage.executeSql(`SELECT * FROM cointable WHERE cName = ?`, [coin]).then(res => {
      return {
        id: res.rows.item(0).id,
        cName: res.rows.item(0).cName,  
        cCoin: res.rows.item(0).cCoin, 
        cPrice: res.rows.item(0).cPrice
      }
    }).catch(e =>console.log("error"));
  }

  deleteCoin(id) {
    return this.storage.executeSql('DELETE FROM cointable WHERE id = ?', [id])
    .then(_ => {
      this.getCoins();
    });
  }

  updateCoin(id, price){

    return this.storage.executeSql(`UPDATE cointable SET cPrice = ? WHERE id = ?`,[price, id])
    .then(data => {
      this.getCoins();
    })
  }
}
