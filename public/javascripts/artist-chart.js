



const printChart = () => {
  axios({
      method: 'get',
      url: 'MONGODB_URI',
      params: {
          currency: currencyEl.value,
          start: startEl.value,
          end: endEl.value
      },
  })


  // ------------------- On veut trouver l'id de l'artsite de la page ------------------- //

  
  // let artistPrinted = user.artistsFollowed
  // Artist.find({
  //     '_id': {
  //       $in: artistPrinted
  //     }
  // })


  // ------------------- On veut choper les followers Spotify de l'artiste ------------------- //

  const ctx = document.getElementById("myChart").getContext('2d');
  const spotifyFlws = artist.datas.deezerFlws

  .catch(err => {
    console.error(err)
  })

  .then(response => {

    const myChart = new Chart(ctx, {
      type:'line',
      data: {
        labels: stockDate,
        datasets: [{
            label: "Followers",
            data: spotifyFlws,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  })
};