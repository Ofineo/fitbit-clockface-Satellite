import document from 'document';
import * as messaging from 'messaging';
import clock from 'clock';
import { display } from 'display';
import { preferences } from 'user-settings';
import { goals, primaryGoal, dayHistory, today } from 'user-activity';

import * as util from '../common/utils';

// Update the clock every minute
clock.granularity = 'minutes';

let background = document.getElementById('background');
const clockHours = document.getElementById('hours');
const clockMinutes = document.getElementById('minutes');
const stepsCircle = document.getElementById('steps_circle');

let myTimer = {
  watchID: null,
  start: function () {
    if (!this.watchID) {
      this.watchID = setInterval(this.doInterval.bind(this), 1500);
    }
  },
  stop: function () {
    clearInterval(this.watchID);
    this.watchID = null;
  },
  doInterval: function () {
    const currentDate = new Date(Date.now()).toUTCString().slice(5, 11);
    // date.text = `${currentDate}`;
    animatedCircles.next();
  },
  wake: function () {
    this.doInterval();
    this.start();
  },
};

myTimer.start();

display.onchange = function () {
  if (display.on) {
    myTimer.wake();
  } else {
    myTimer.stop();
  }
};

const animatedCircles = {
  current: 0,
  steps: [
    { from: 0, to: 90 },
    { from: 90, to: 180 },
    { from: 180, to: 270 },
    { from: 270, to: 360 },
  ],
  next() {
    if (this.current >= this.steps.length) {
      this.current = 0;
    }
    stepsCircle.from = this.steps[this.current].from;
    stepsCircle.to = this.steps[this.current].to;
    stepsCircle.animate('enable');
    this.current++;
  },
};

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === '12h') {
    // 12h format
    hours = hours % 12 || 12;
  }
  // else {
  //   // 24h format
  //   hours = util.zeroPad(hours);
  // }
  let mins = util.zeroPad(today.getMinutes());
  clockMinutes.text = `${mins}`;
  clockHours.text = `${hours}`;
};

// Message is received
messaging.peerSocket.onmessage = (evt) => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === 'color' && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    background.style.fill = color;
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log('App Socket Open');
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log('App Socket Closed');
};
