'use strict'

let song;
let playButton;
let volumeSlider

function preload() {
  song = loadSound('../assets/music/astronomy-self-texture.mp3');
}

function setup() {
  playButton = select('#playButton');
  console.log(playButton);
  volumeSlider = select('#volumeSlider');
  playButton.mousePresed(playSong);
}

function draw() {
song.setVolume(volumeSlider.value()/10)
console.log(volumeSlider.value());
}

function playSong(){
  if (song.isPlaying()){
    song.stop();
    playButton.html('play')
  } else{
    song.loop()
    playButton.html('stop')
  }
  song.play();
}
