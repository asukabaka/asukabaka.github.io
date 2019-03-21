'use strict'

let buttonSound;
let buttons = [];

function preload(){
  buttonSound = loadSound('../assets/sfx/cameraClick.mp3');
}

function setup() {
  buttons = selectAll('button');

  for (let i=0; i<buttons. length; i++){
    buttons[i].mousePresed(playSound);
  }
  buttons.mousePresed(playSound);
}

function draw() {
}

function playSound(){
  buttonSound.play()
}
