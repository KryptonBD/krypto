import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { SearchPage } from '../search/search';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  detailToggle = [];
  objectKeys = Object.keys;
  likedCoins = [];
  chart = [];
  coins: Object;
  details: Object;
  constructor(
    public navCtrl: NavController,
    private _data: DataProvider,
    private storage: Storage,
    public loading: LoadingController) {

  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.refreshCoins();
  }

  refreshCoins() {
    let loader = this.loading.create({
      content: 'Refreshing...',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.storage.get("likedCoins").then(res => {
        //If value is not set
        if (!res) {
          this.likedCoins.push('BTC', 'ETH', 'LTC');
          this.storage.set("likedCoins", this.likedCoins);
          this.getCoins(loader);
        } else {
          this.likedCoins = res;
          this.getCoins(loader);
        }
      })
    })


  }

  getCoins(loader) {
    this._data.getCoins(this.likedCoins).subscribe(result => {
      //console.log(result)
      this.coins = result;
      loader.dismiss();
    })
  }

  showSearch() {
    this.navCtrl.push(SearchPage);
  }

  coinDetails(coin, index) {
    if (this.detailToggle[index]) {
      this.detailToggle[index] = false;
    }
    else {
      this.detailToggle.fill(false);
      this._data.getCoin(coin).subscribe(res => {
        // console.log(res['DISPLAY']);
        this.details = res['DISPLAY'][coin]['USD'];
        this.detailToggle[index] = true;

        this._data.getChart(coin).subscribe(res => {
          //console.log(res);
          let coinHistory = res['Data'].map((a) => (a.volumetotal));

          setTimeout(() => {
            this.chart[index] = new Chart('canvas' + index, {
              type: 'line',
              data: {
                labels: coinHistory,
                datasets: [{
                  data: coinHistory,
                  borderColor: '#3cba9f',
                  fill: false
                }],
                //datasets end
                options: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: false
                  },
                  tooltips: {
                    callbacks: {
                      label: function (tooltipItem, data) {
                        return '$' + tooltipItem.yLabel.toString();
                      }
                    }
                  },

                  responsive: true,
                  scales: {
                    xAxes: [{
                      ticks: {
                        display: false
                      }
                    }],
                    yAxes: [{
                      ticks: {
                        display: false
                      }
                    }]
                  }
                }
                //Options End
              }
              //data end
            })
          }, 300);
        }) //getChart function end
      })
    }
  }

  swiped(index) {
    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);
    this.likedCoins = this.likedCoins.filter(item => {
      return item !== coin;
    });

    this.storage.set("likedCoins", this.likedCoins);
    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }


}
