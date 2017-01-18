import React, { Component } from 'react';
import { initSocket } from '../socket';
import style from '../styles/dashboardStyles';

let socket;

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { markers: [] };
    this.connectSocket = this.connectSocket.bind(this);
  }

  componentDidMount() {
    this.connectSocket();
    // setup initial map
    this.map = new google.maps.Map(this.refs.map, {
      zoom: 2,
      center: new google.maps.LatLng(2.8,-187.3),
      mapTypeId: 'terrain',
    });
  }

  connectSocket() {
    socket = initSocket(io);
    // grab already connected clients
    socket.emit('getInitialClients');
      // add a new marker when a new client enters location info
      socket.on('addNewClient', (data) => {
        if (data.length > 0) {
          const markersArr = [];
          data.forEach((item) => {
            const key = Object.keys(item)[0];
            const map = this.map;
            const latLng = new google.maps.LatLng(item[key].lat, item[key].long);
            const marker = new google.maps.Marker({ position: latLng, map });
            const newMarker = {};
            newMarker[key] = marker;
            markersArr.push(newMarker);
          });
          const oldMarkers = this.state.markers;
          const newMarkers = oldMarkers.concat(markersArr);
          this.setState({ markers: newMarkers });
        }
      });
    // delete marker on client disconnect
    socket.on('clientDisconnected', (data) => {
      const key = data.delete;
      const newMarkers = this.state.markers.filter((item) => {
        if (item[key]) {
          const removeMarker = item[key];
          removeMarker.setMap(null);
        } else {
          return item;
        }
      });
      this.setState({ markers: newMarkers });
    });
  }

  render() {
    return (
      <div style={style.container}>
        <div>
          <h1 style={style.heading}>Location Information</h1>
          <div style={style.mapContainer}>
            <div ref="map" style={style.mapStyle}>I should be a map!</div>
          </div>
        </div>
      </div>
    );
  }
}
