import {DESTINATION_POINTS_MOCKS} from '../const.js';
import SortView from '../view/sort.js';
import EditView from '../view/edit.js';
import ListView from '../view/list.js';
import WaypointView from '../view/waypoint.js';
import NoWaypointView from '../view/nowaypoint.js';
import {render, renderPosition, replace} from '../utils/render.js';
import {generateWaypoint} from '../mock/waipoint.js';

export default class Trip {
  constructor() {
    this._noWaypointComponent = new NoWaypointView();
    this._listComponent = new ListView();
  }

  init() {
    this._renderTrip();
  }

  _renderList() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._listComponent, renderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortComponent = new SortView();
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._sortComponent, renderPosition.BEFOREEND);
  }

  _renderWaypoint(element, waypoint) {
      this._waypointComponent = new WaypointView(waypoint);
      this._editComponent = new EditView(waypoint);

      const replaceWaypointToForm = () => {
        replace(this._editComponent,this._waypointComponent);
      };

      const replaceFormToWaypoint = () => {
        replace(this._waypointComponent,this._editComponent);
      };

      const onEscKeyPress = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          replaceFormToWaypoint();
          document.removeEventListener('keydown', onEscKeyPress);
        }
      };

      this._waypointComponent.setWaypointClickHandler(() => {
        replaceWaypointToForm();
        document.addEventListener('keydown', onEscKeyPress);
      });

      this._editComponent.setEditSubmitHandler(() => {
        replaceFormToWaypoint();
        document.removeEventListener('keydown', onEscKeyPress);
      });

      this._editComponent.setEditClickHandler(() => {
        replaceFormToWaypoint();
        document.removeEventListener('keydown', onEscKeyPress);
      });

      render(element, this._waypointComponent, renderPosition.BEFOREEND);
  };

  _renderWaypoints() {
    const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const listElement = eventElement.querySelector('.trip-events__list');
    if (DESTINATION_POINTS_MOCKS > 0) {
      for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
        this._renderWaypoint(listElement, waypoints[i]);
      }
    }
  }

  _renderNoWaypoint() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._noWaypointComponent, renderPosition.BEFOREEND);
  }

  _renderTrip() {
    this._renderSort();
    this._renderList();

    if (DESTINATION_POINTS_MOCKS > 0) {
      this._renderWaypoints();
    } else {
      this._renderNoWaypoint();
    }
  }
}
