import Chart from 'chart.js';
import dayjs from 'dayjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from '../view/smart.js';
import {TYPES} from '../const.js';
import {arrayOfFilterType} from '../utils/common.js';

const BAR_HEIGHT = 55;

const NAMES_OF_CHART = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIMESPEND: 'TIME-SPEND',
};

const types = TYPES.slice().map((item) => item.toUpperCase());

const sortByField = (field) => {
  return (a, b) => a[field] < b[field] ? 1 : -1;
};

const renderChart = (context, arrayOfTypes, arrayOfChart, namesOfChart, format) => {
  return new Chart(context, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: arrayOfTypes,
      datasets: [{
        data: arrayOfChart,
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
          formatter: format,
        },
      },
      title: {
        display: true,
        text: namesOfChart,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 3,
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

const renderMoneyChart = (moneyCtx, waypoints) => {
  moneyCtx.height = BAR_HEIGHT * 10;

  const sumOfType = (elements) => {
    let sum = 0;

    elements.map((element) => {
      sum += element.price;
    });

    return sum;
  };

  const sumOfFilteredTypes = (array) => {
    return array.map((element) => {
      if (element.length === 0) {
        element = 0;
      } else {
        return (sumOfType(element));
      }
    });
  };

  const finalArrayOfTypes = sumOfFilteredTypes(arrayOfFilterType(waypoints, TYPES));

  const formatOfTypes = {
    MONEY: (finalArrayOfTypes) => '€ ' + finalArrayOfTypes,
  };

  const arrayOfpoints = [];

  for (let i = 0; i < types.length;i++) {
    for (let j = 0; j < finalArrayOfTypes.length; j++) {
      if (i === j) {
        arrayOfpoints.push({type: types[i], price: finalArrayOfTypes[j]});
      }
    }
  }

  arrayOfpoints.sort(sortByField('price'));

  const arrayOfType = [];
  const arrayOfTotalPrice = [];

  arrayOfpoints.map((item) => arrayOfType.push(item.type));

  arrayOfpoints.map((item) => arrayOfTotalPrice.push(item.price));

  renderChart(moneyCtx, arrayOfType, arrayOfTotalPrice, NAMES_OF_CHART.MONEY, formatOfTypes.MONEY);
};

const renderTypeChart = (typeCtx, waypoints) => {
  typeCtx.height = BAR_HEIGHT * 10;

  const countOfFilteredTypes = (array) => {
    return array.map((element) => {
      if (element.length === 0) {
        return element = 0;
      } else {
        return element.length;
      }
    });
  };

  const arrayOfCount = countOfFilteredTypes(arrayOfFilterType(waypoints, TYPES));

  const formatOfTypes = {
    TYPE: (arrayOfCount) =>  + arrayOfCount + 'x',
  };

  const arrayOfpoints = [];

  for (let i = 0; i < types.length;i++) {
    for (let j = 0; j < arrayOfCount.length; j++) {
      if (i === j) {
        arrayOfpoints.push({type: types[i], count: arrayOfCount[j]});
      }
    }
  }

  arrayOfpoints.sort(sortByField('count'));

  const arrayOfType = [];
  const arrayOfTotalCount = [];

  arrayOfpoints.map((item) => arrayOfType.push(item.type));

  arrayOfpoints.map((item) => arrayOfTotalCount.push(item.count));

  renderChart(typeCtx, arrayOfType, arrayOfTotalCount, NAMES_OF_CHART.TYPE, formatOfTypes.TYPE);
};

const renderTimeSpendChart = (timeSpendCtx, waypoints) => {
  timeSpendCtx.height = BAR_HEIGHT * 10;

  function ConvertMinutes(num) {
    const hours = Math.floor(num / 60);
    const days = Math.floor(hours / 24);
    const rhours = hours - days * 24;
    const minutes = Math.floor(num % 60);
    const dateObj = {
      D: days < 10 ? '0' + days : days,
      H: rhours < 10 ? '0' + rhours : rhours,
      M: minutes < 10 ? '0' + minutes : minutes,
    };

    if (num === 0) {
      return 0;
    }

    return Object.keys(dateObj).map((item) =>
      dateObj[item] > 0 ? dateObj[item] + item : ' ').join(' ').trim();
  }

  const timeDifference = (elements) => {
    let sumOfTime = 0;

    for (let i = 0; i < elements.length; i++) {

      const num = dayjs(elements[i].upperTime).diff(dayjs(elements[i].lowerTime), 'minutes');
      sumOfTime += num;
    }

    return sumOfTime;
  };

  const timeOfFilteredTypes = (array) => {
    return array.map((element) => {
      if (element.length === 0) {
        return element = 0;
      } else {
        return timeDifference(element);
      }
    });
  };

  const arrayOfTime = timeOfFilteredTypes(arrayOfFilterType(waypoints, TYPES));

  const formatOfTypes = {
    TIMESPEND: (arrayOfTime) => ConvertMinutes(arrayOfTime),
  };

  const arrayOfpoints = [];

  for (let i = 0; i < types.length;i++) {
    for (let j = 0; j < arrayOfTime.length; j++) {
      if (i === j) {
        arrayOfpoints.push({type: types[i], time: arrayOfTime[j]});
      }
    }
  }

  arrayOfpoints.sort(sortByField('time'));

  const arrayOfType = [];
  const arrayOfTotalTime = [];

  arrayOfpoints.map((item) => arrayOfType.push(item.type));

  arrayOfpoints.map((item) => arrayOfTotalTime.push(item.time));

  renderChart(timeSpendCtx, arrayOfType, arrayOfTotalTime, NAMES_OF_CHART.TIMESPEND, formatOfTypes.TIMESPEND);
};

const createStatisticsTemplate = () => {

  return `<section class="statistics">
            <h2 class="visually-hidden">Trip statistics</h2>

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

    this._setCharts();
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
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');

    this._moneyChart = renderMoneyChart(moneyCtx, this._waypoints);
    this._typeChart = renderTypeChart(typeCtx, this._waypoints);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._waypoints);
  }
}
