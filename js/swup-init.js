const options = {
  className: 'swup-progress-bar',
  transition: 300,
  delay: 300
}


const swup = new Swup(
{
  plugins: [new SwupProgressPlugin(options)]

}
); // only this line when included with script tag
