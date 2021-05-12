import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from '../view/smart.js';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx) => {

  moneyCtx.height = BAR_HEIGHT * 5;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'TRANSPORT', 'DRIVE'],
      datasets: [{
        data: [400, 300, 200, 160, 150, 100],
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          //formatter: (val) => '€ ${val}',
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx) => {

  typeCtx.height = BAR_HEIGHT * 5;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'TRANSPORT', 'DRIVE'],
      datasets: [{
        data: [4, 3, 2, 1, 1, 1],
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          //formatter: (val) => '${val}x',
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

//const renderTimeSpendChart = (timeSpendCtx, waypoint) => {
//
//};

const createStatisticsTemplate = () => {

  return `<section class="statistics">
            <h2>Trip statistics</h2>

            <div class="statistics__item statistics__item--money">
              <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--transport">
              <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--time-spend">
              <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
            </div>
          </section>`;
};

export default class Statistics extends SmartView {
  constructor(waypoints) {
    super();

    this._waypoints = waypoints;
    this._moneysChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart) {
      this._moneyChart = null;
      this._timeSpendChart = null;
      this._typeChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._waypoints);
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart) {
      this._moneyChart = null;
      this._timeSpendChart = null;
      this._typeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    //const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');

    this._moneyChart = renderMoneyChart(moneyCtx, this._waypoints);
    this._typeChart = renderTypeChart(typeCtx, this._waypoints);
    //this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._waypoints);
  }
}
