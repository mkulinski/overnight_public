import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import style from '../styles/helloStyles';
import { initSocket } from '../socket';

let socket;

export default class Login extends Component {
  constructor() {
    super();
    const geocoder = new google.maps.Geocoder();
    this.state = { geocoder };
    socket = initSocket(io);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(evt) {
    evt.preventDefault();
    // grab username and password from form
    const username = this.refs.username.value;
    const address = this.refs.address.value;
    // go to dashboard
    if (username === 'admin') {
      browserHistory.push('/dashboard');
    }
    // send geocoded info
    this.state.geocoder.geocode({ address }, (response, status) => {
      if (status === 'OK') {
        const lat = response[0].geometry.location.lat();
        const long = response[0].geometry.location.lng();
        // send client info to server
        socket.emit('connected-client', { username, lat, long });
      }
    });
    // reset form
    this.refs.username.value = '';
    this.refs.address.value = '';
  }

  render() {
    return (
      <div style={style.topContainer}>
        <div style={style.container}>
          <h1 style={style.heading}>Login</h1>
          <form onSubmit={this.onSubmit} style={style.form}>
            <label style={style.label}>Username</label>
            <input type="text" ref="username" style={style.input} />
            <label style={style.label}>Location</label>
            <input type="text" ref="address" style={style.input} />
            <button type="submit" className="submit-button" style={style.buttonStyle}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
