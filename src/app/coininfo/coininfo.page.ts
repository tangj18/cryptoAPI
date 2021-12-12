import { NONE_TYPE } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js';
import { $ } from 'protractor';
import { Observable } from 'rxjs';
import { CryptoService } from '../crypto.service';
import { CryptodatabaseService } from '../cryptodatabase.service';

Chart.register(...registerables);


@Component({
  selector: 'app-coininfo',
  templateUrl: './coininfo.page.html',
  styleUrls: ['./coininfo.page.scss'],
})
export class CoininfoPage implements OnInit {
  coinName: string;
  coinFullName: string;
  isLoading = false;
  result: any;
  resultPrice: string;
  resultChangeDay: string;
  resultChange24h: string;
  arrow: boolean;
  arrowText: string;

  hourData: any;
  hourArray: Observable<any>;
  chartData: any = [];
  chartLabel: any = [];

  coinDB: any[] = [];

  constructor(private router: Router, private cryptoservice: CryptoService, private db: CryptodatabaseService) {
    this.coinName = this.router.getCurrentNavigation().extras.state.name;
    this.coinFullName = this.router.getCurrentNavigation().extras.state.fullName;
   }

  ngOnInit() {
    this.searchCrypto(this.coinName);
    this.get1Hour();
    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchCoins().subscribe(item => {
          this.coinDB = item;
        })
      }
    });
    
    let found = false;
    for(let i = 0; i < this.coinDB.length; i++){
      if(this.coinDB[i].cCoin == this.coinName){
        found = true;
      }
    }
    if(found){
      document.getElementById("star").innerHTML = '&nbsp;';
      document.getElementById("star").innerHTML = ' <ion-icon name="star" style="font-size: 30px; padding-right: 20px;"></ion-icon>';

    }else{
      document.getElementById("star").innerHTML = '&nbsp;';
      document.getElementById("star").innerHTML = ' <ion-icon name="star-outline" style="font-size: 30px; padding-right: 20px;"></ion-icon>';

    }

  }

  testFunction(){

    let tempData: any[] = [];
    let tempFound = false;
    let tempId;
    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchCoins().subscribe(item => {
          tempData = item;
        })
      }
    });
    console.log(tempData);
    for(let i = 0; i < tempData.length; i++){
      if(tempData[i].cCoin == this.coinName){
        tempFound = true;
        tempId = tempData[i].id;
      }
    }
    if(tempFound){
      this.db.deleteCoin(tempId);
      
    }else{
      this.db.addCoin(this.coinFullName, this.coinName, this.resultPrice );
    }
    
    this.ngOnInit();
  }

  searchCrypto(coin) {
    let tempString = coin;
    this.isLoading = true;
    this.result = this.cryptoservice.searchCrypto(tempString).subscribe(
      data => {
        this.result = data;
        //working with price (convert to CAD ### to just ### then change to absolute value)
        this.resultPrice = this.result.DISPLAY[tempString].CAD.PRICE;
        this.resultPrice = this.cutString(this.resultPrice);

        this.resultChangeDay = this.result.DISPLAY[tempString].CAD.CHANGE24HOUR;
        this.resultChangeDay = this.cutString(this.resultChangeDay);
        this.arrow = this.resultChangeDay.includes('-');

        if (this.arrow) {
          this.arrowText = "▼";
        } else {
          this.arrowText = "▲";
        }

        this.resultChangeDay = this.resultChangeDay.replace(',', '');
        this.resultChangeDay = this.resultChangeDay.replace('-', '');
        this.resultChange24h = this.result.DISPLAY[tempString].CAD.CHANGEPCT24HOUR;
        this.result = Array.of(this.result.DISPLAY[tempString].CAD);
      },
      err => {
        console.log(err);
      },
      () => console.log("data got here"));
    this.isLoading = false;
  }

  resetCanvas(){
    document.getElementById("lineGraph").innerHTML = '&nbsp;';
    document.getElementById("lineGraph").innerHTML = '<canvas id="myChart" width="350" height="350"></canvas>';
  }

  get1Hour() {
    
    this.resetCanvas();
    let tempString = this.coinName;
    this.chartData = [];
    this.chartLabel = [];
    this.hourData = this.cryptoservice.getByMinute(tempString).subscribe(
      data => {
        this.hourData = data;
        this.hourArray = this.hourData.Data;
        
        for(let i = 1381; i < 1441; i++){

          var date = new Date(this.hourArray[i].time * 1000);
          //var timeString = 
          this.chartData.push(this.hourArray[i].high);
          this.chartLabel.push(date);
          console.log(this.hourArray[i].high + " " + this.hourArray[i].time);
        }

        
      },
      err => console.log(err),
      () => {
        var myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.chartLabel,
            datasets: [{
              label: "High Value",
              data: this.chartData,
              borderColor: "#3e95cd",
              backgroundColor: '#6cbff5',
              borderWidth: 1,
              fill:{
                target: 'origin',
                below: '#6cbff5'
              }
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
                
              }
    
            },
            scales: {
              x: {
                display: false
              },
              yAxes: {
                display: true
              }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
          
          }
        });
      }
    );
  }

  get1d() {
    this.resetCanvas();
    let tempString = this.coinName;
    this.chartData = [];
    this.chartLabel = [];
    this.hourData = this.cryptoservice.getByMinute(tempString).subscribe(
      data => {
        this.hourData = data;
        this.hourArray = this.hourData.Data;
        
        for(let i = 0; i < 1441; i++){

          var date = new Date(this.hourArray[i].time * 1000);
          //var timeString = 
          this.chartData.push(this.hourArray[i].high);
          this.chartLabel.push(date);
          console.log(this.hourArray[i].high + " " + this.hourArray[i].time);
        }

        
      },
      err => console.log(err),
      () => {
        
        var myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.chartLabel,
            datasets: [{
              label: "High Value",
              data: this.chartData,
              borderColor: "#3e95cd",
              backgroundColor: '#6cbff5',
              borderWidth: 1,
              fill:{
                target: 'origin',
                below: '#6cbff5'
              }
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
                
              }
    
            },
            scales: {
              x: {
                display: false
              },
              yAxes: {
                display: true
              }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
          
          }
        });
      }
    );
  }

  get5d() {
    this.resetCanvas();
    let tempString = this.coinName;
    this.chartData = [];
    this.chartLabel = [];
    this.hourData = this.cryptoservice.getByHour(tempString).subscribe(
      data => {
        this.hourData = data;
        this.hourArray = this.hourData.Data;
        
        for(let i = 609; i < 730; i++){

          var date = new Date(this.hourArray[i].time * 1000);
          //var timeString = 
          this.chartData.push(this.hourArray[i].high);
          this.chartLabel.push(date);
          console.log(this.hourArray[i].high + " " + this.hourArray[i].time);
        }

        
      },
      err => console.log(err),
      () => {
        
        var myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.chartLabel,
            datasets: [{
              label: "High Value",
              data: this.chartData,
              borderColor: "#3e95cd",
              backgroundColor: '#6cbff5',
              borderWidth: 1,
              fill:{
                target: 'origin',
                below: '#6cbff5'
              }
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
                
              }
    
            },
            scales: {
              x: {
                display: false
              },
              yAxes: {
                display: true
              }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
          
          }
        });
      }
    );
  }

  get1M() {
    this.resetCanvas();
    let tempString = this.coinName;
    this.chartData = [];
    this.chartLabel = [];
    this.hourData = this.cryptoservice.getByHour(tempString).subscribe(
      data => {
        this.hourData = data;
        this.hourArray = this.hourData.Data;
        
        for(let i = 0; i < 730; i++){

          var date = new Date(this.hourArray[i].time * 1000);
          //var timeString = 
          this.chartData.push(this.hourArray[i].high);
          this.chartLabel.push(date);
          console.log(this.hourArray[i].high + " " + this.hourArray[i].time);
        }

        
      },
      err => console.log(err),
      () => {
        
        var myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.chartLabel,
            datasets: [{
              label: "High Value",
              data: this.chartData,
              borderColor: "#3e95cd",
              backgroundColor: '#6cbff5',
              borderWidth: 1,
              fill:{
                target: 'origin',
                below: '#6cbff5'
              }
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
                
              }
    
            },
            scales: {
              x: {
                display: false
              },
              yAxes: {
                display: true
              }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
          
          }
        });
      }
    );
  }

  get6M() {
    this.resetCanvas();
    let tempString = this.coinName;
    this.chartData = [];
    this.chartLabel = [];
    this.hourData = this.cryptoservice.getByDay(tempString).subscribe(
      data => {
        this.hourData = data;
        this.hourArray = this.hourData.Data;
        
        for(let i = 183; i < 366; i++){

          var date = new Date(this.hourArray[i].time * 1000);
          //var timeString = 
          this.chartData.push(this.hourArray[i].high);
          this.chartLabel.push(date);
          console.log(this.hourArray[i].high + " " + this.hourArray[i].time);
        }

        
      },
      err => console.log(err),
      () => {
        
        var myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.chartLabel,
            datasets: [{
              label: "High Value",
              data: this.chartData,
              borderColor: "#3e95cd",
              backgroundColor: '#6cbff5',
              borderWidth: 1,
              fill:{
                target: 'origin',
                below: '#6cbff5'
              }
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
                
              }
    
            },
            scales: {
              x: {
                display: false
              },
              yAxes: {
                display: true
              }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
          
          }
        });
      }
    );
  }
  get1Y() {
    this.resetCanvas();
    let tempString = this.coinName;
    this.chartData = [];
    this.chartLabel = [];
    this.hourData = this.cryptoservice.getByDay(tempString).subscribe(
      data => {
        this.hourData = data;
        this.hourArray = this.hourData.Data;
        
        for(let i = 0; i < 365; i++){

          var date = new Date(this.hourArray[i].time * 1000);
          //var timeString = 
          this.chartData.push(this.hourArray[i].high);
          this.chartLabel.push(date);
          console.log(this.hourArray[i].high + " " + this.hourArray[i].time);
        }

        
      },
      err => console.log(err),
      () => {
        
        var myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.chartLabel,
            datasets: [{
              label: "High Value",
              data: this.chartData,
              borderColor: "#3e95cd",
              backgroundColor: '#6cbff5',
              borderWidth: 1,
              fill:{
                target: 'origin',
                below: '#6cbff5'
              }
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
                
              }
    
            },
            scales: {
              x: {
                display: false
              },
              yAxes: {
                display: true
              }
            },
            elements: {
              point:{
                  radius: 0
              }
          }
          
          }
        });
      }
    );
  }
  
  returnArrow() {
    return this.arrow;
  }

  cutString(coin) {
    var splitted = coin.split(" ", 2);
    console.log(splitted);
    return splitted[1];

  }

}
