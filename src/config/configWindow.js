import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import * as $ from 'jquery';
import Pusher from 'pusher-js';
import _ from 'lodash';

// Notification data
let pusher = new Pusher('f9a2f81061f58802038f', {
  wsHost: 'ws.pusherapp.com',
  httpHost: 'sockjs.pusher.com',
  encrypted: true
});

/* Setting window values */
window["$"] = $;
window["jQuery"] = $;
window.swal = swal;
window.axios = axios;
window.moment = moment;
window.pusher = pusher;
window._ = _;