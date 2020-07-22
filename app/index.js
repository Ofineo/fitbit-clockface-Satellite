import document from "document";
import * as messaging from "messaging";
import clock from 'clock';
import { display } from 'display';
import { preferences } from 'user-settings';
import { goals, primaryGoal, dayHistory, today } from 'user-activity';

import * as util from '../common/utils';


// Update the clock every minute
clock.granularity = 'minutes';

let background = document.getElementById("background");
const clockHours = document.getElementById('hours');
const clockMinutes = document.getElementById('minutes');










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
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    background.style.fill = color;
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};
