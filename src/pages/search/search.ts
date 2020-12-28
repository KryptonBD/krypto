import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  objectKeys = Object.keys;
  likedCoins = [];
  raw = [];
  liked = [];
  allCoins: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    private _data: DataProvider,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
    let loader = this.loading.create({
      content: 'Refreshing...',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.storage.get('likedCoins').then(val => {
        this.likedCoins = val;
      })
    });

    //In order to save api key calls later saving data in storgae
    this.storage.get("prevLoadedCoin").then(coins => {
      if (!coins) {
        this._data.allCoins().subscribe(res => {
          //console.log(res);
          this.raw = res['Data'];
          this.allCoins = res['Data'];
          loader.dismiss();
          this.storage.set("prevLoadedCoin", res['Data']);
        })
      } else {
        this.allCoins = coins;
        this.raw = coins;
        loader.dismiss();
      }
    })


  }

  searchCoins(ev: any) {
    let val = ev.target.value;
    this.allCoins = this.raw;

    if (val && val.trim() != "" && val.length >= 2) {
      let filterArr = [];

      const filterd = Object.keys(this.allCoins)
        .filter(key => {
          let shortName = this.allCoins[key]['CoinInfo']['Name'];
          let fullName = this.allCoins[key]['CoinInfo']['FullName'];

          if (val.toUpperCase().includes(shortName) || shortName.includes(val.toUpperCase()) || fullName.toUpperCase().includes(val.toUpperCase())) {
            filterArr.push(this.allCoins[key])
            return this.allCoins[key];
          }
        });

      if (filterArr.length != 0) {
        this.allCoins = filterArr;
      }

    }

  }

  //Adding Coins
  addCoin(coin) {
    let newCoin = coin['CoinInfo']['Name']
    this.likedCoins.push(newCoin);
    this.storage.set("likedCoins", this.likedCoins);
  }

}
