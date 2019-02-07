document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);




const selectedArtist = []

$("#selectArtist").click(function () {
  target = event.target.innerHTML;
  selectedArtist.push(target)
});