import Chart from 'chart.js';
import dayjs from 'dayjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from '../view/smart.js';
import {TYPES} from '../const.js';
import {filterOfType, convertMinutes} from '../utils/common.js';

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

const renderChart = (context, listOfTypes, dataOfChart, namesOfChart, format) => {
  return new Chart(context, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: listOfTypes,
      datasets: [{
        data:  dataOfChart,
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

  const totalPriceOfType = (elements) => {
    let totalPriceOfType = 0;

    elements.map((element) => {
      totalPriceOfType += element.price;
    });

    return totalPriceOfType;
  };

  const totalPriceOfFilteredTypes = (array) => {
    return array.map((element) => {
      console.log(element)
      if (element.length === 0) {
        element = 0;
      } else {
        return (totalPriceOfType(element));
      }
    });
  };

  const finalListOfTypes = totalPriceOfFilteredTypes(filterOfType(waypoints, TYPES));

  const formatOfTypes = {
    MONEY: (finalListOfTypes) => '€ ' +  finalListOfTypes,
  };

  const listOfPoints = [];

  types.forEach((element, index) => {
    listOfPoints.push({type: element, price: finalListOfTypes[index]});
  });

  listOfPoints.sort(sortByField('price'));

  const typesOrder = [];
  const totalPriceOrder = [];

  listOfPoints.forEach((item) => typesOrder.push(item.type));

  listOfPoints.forEach((item) => totalPriceOrder.push(item.price));

  renderChart(moneyCtx, typesOrder, totalPriceOrder, NAMES_OF_CHART.MONEY, formatOfTypes.MONEY);
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

  const countList = countOfFilteredTypes(filterOfType(waypoints, TYPES));

  const formatOfTypes = {
    TYPE: (countList) =>  + countList + 'x',
  };

  const listOfPoints = [];

  types.forEach((element, index) => {
    listOfPoints.push({type: element, count: countList[index]});
  });

  listOfPoints.sort(sortByField('count'));

  const typesOrder = [];
  const totalPriceOrder = [];

  listOfPoints.forEach((item) => typesOrder.push(item.type));

  listOfPoints.forEach((item) => totalPriceOrder.push(item.count));

  renderChart(typeCtx, typesOrder, totalPriceOrder, NAMES_OF_CHART.TYPE, formatOfTypes.TYPE);
};

const renderTimeSpendChart = (timeSpendCtx, waypoints) => {
  timeSpendCtx.height = BAR_HEIGHT * 10;

  const timeDifference = (elements) => {
    let totalTime = 0;

    for (let i = 0; i < elements.length; i++) {

      const num = dayjs(elements[i].upperTime).diff(dayjs(elements[i].lowerTime), 'minutes');
      totalTime += num;
    }

    return totalTime;
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

  const listOfTime = timeOfFilteredTypes(filterOfType(waypoints, TYPES));

  const formatOfTypes = {
    TIMESPEND: (listOfTime) => convertMinutes(listOfTime),
  };

  const listOfPoints = [];

  types.forEach((element, index) => {
    listOfPoints.push({type: element, time: listOfTime[index]});
  });

  listOfPoints.sort(sortByField('time'));

  const typesOrder = [];
  const totalPriceOrder = [];

  listOfPoints.forEach((item) => typesOrder.push(item.type));

  listOfPoints.forEach((item) => totalPriceOrder.push(item.time));

  renderChart(timeSpendCtx, typesOrder, totalPriceOrder, NAMES_OF_CHART.TIMESPEND, formatOfTypes.TIMESPEND);
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
