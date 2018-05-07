import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import * as $ from 'jquery';

/* Setting window values */
window["$"] = $;
window["jQuery"] = $;
window.swal = swal;
window.axios = axios;
window.moment = moment;