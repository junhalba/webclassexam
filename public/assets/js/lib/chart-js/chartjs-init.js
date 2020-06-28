$(document).ready(function(){
    //bar chart
     var ctx = document.getElementById('barChart').getContext('2d');
     // ctx.height = 200;
     var myChart = new Chart(ctx, {
         type: 'bar',
         data: {
             labels: ["January", "February", "March", "April", "May", "June", "July"],
             datasets: [
                 {
                     label: "My First dataset",
                     data: [65, 59, 80, 81, 56, 55, 40],
                     borderColor: "rgba(55, 160, 0, 0.9)",
                     borderWidth: "0",
                     backgroundColor: "rgba(55, 160, 0, 0.5)"
                             },
                 {
                     label: "My Second dataset",
                     data: [28, 48, 40, 19, 86, 27, 90],
                     borderColor: "rgba(0,0,0,0.09)",
                     borderWidth: "0",
                     backgroundColor: "rgba(0,0,0,0.07)"
                             }
                         ]
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
     });


     //pie chart
     var ctx = document.getElementById("pieChart");
     ctx.height = 170;
     var myChart = new Chart(ctx, {
         type: 'pie',
         data: {
             datasets: [{
                 data: [45, 25, 20, 10],
                 backgroundColor: [
                                     "rgba(55,160,0,0.9)",
                                     "rgba(55,160,0,0.7)",
                                     "rgba(55,160,0,0.5)",
                                     "rgba(0,0,0,0.07)"
                                 ],
                 hoverBackgroundColor: [
                                     "rgba(55,160,0,0.9)",
                                     "rgba(55,160,0,0.7)",
                                     "rgba(55,160,0,0.5)",
                                     "rgba(0,0,0,0.07)"
                                 ]

                             }],
             labels: [
                             "green",
                             "green",
                             "green"
                         ]
         },
         options: {
             responsive: true
         }
     });
 });