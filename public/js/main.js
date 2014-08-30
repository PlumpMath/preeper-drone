(function() {
  'use strict';

  var host = window.document.location.host.replace(/:.*/, '');
  var ws = new WebSocket('ws://' + host + ':5000');

  ws.onmessage = function(e) {
    var data = JSON.parse(e.data);
    updateStats(data);
  };

  ws.onopen = function() {
    addListeners();
  };

  function $(el) {
    return document.querySelectorAll(el);
  }

  var dataContainer = $('.data')[0];
  var flyingEl = $('.flying')[0];
  var altEl = $('.altitude')[0];

  function updateStats(navData) {
    var altitude = navData.demo.altitude;
    var flying = navData.droneState.flying;

    if (flying && !flyingEl.classList.contains('active')) {
      flyingEl.classList.add('active');
    } else if (!flying && flyingEl.classList.contains('active')) {
      flyingEl.classList.remove('active');
    }

    altEl.innerHTML = altitude.toString();
  }

  function addListeners() {
    var takeoffBtn = $('.takeoff')[0];
    var landBtn = $('.land')[0];

    takeoffBtn.addEventListener('click', function(e) {
      e.preventDefault();

      ws.send('command:takeoff');
    });

    landBtn.addEventListener('click', function(e) {
      e.preventDefault();

      ws.send('command:land');
    });
  }
}());
