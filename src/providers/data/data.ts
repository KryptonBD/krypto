import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {
  result: any;
  constructor(public http: HttpClient) {

  }

  getCoins(coins) {
    let coinList = '';
    coinList = coins.join(',');
    
    return this.http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms="+coinList+"&tsyms=USD")
    .map(result => this.result = result);
  }

  getCoin(coin) {
    return this.http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms="+coin+"&tsyms=USD")
    .map(result => this.result = result);
  }

  getChart(coin) {
    return this.http.get("https://min-api.cryptocompare.com/data/exchange/symbol/histoday?e=Coinbase&fsym="+coin+"&tsym=USD&limit=30&aggregate=1")
    .map(result => this.result = result);
  }
}
