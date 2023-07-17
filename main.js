google.charts.load("current", {
  callback: drawGID,
  packages: ["gantt"],
  language: "ru",
});

function getData(queryString) {
  var query = new google.visualization.Query(
    "https://docs.google.com/spreadsheets/d/1Eixgw3alGojQLnfyqRQTln160OA1bDR_7zeYLg8lVOI/edit#gid=0&headers=1&tq=" +
      queryString
  );
  query.send(handleSampleDataQueryResponse);
}

function drawGID() {
  var queryString = encodeURIComponent("SELECT A, B, C, D, E, F, G, H");
  console.log(queryString);
  getData(queryString);

  // повторить с интервалом 2 секунды
  let timerId = setInterval(() => getData(queryString), 5000);
  // остановить вывод через 5 секунд
  setTimeout(() => {
    clearInterval(timerId);
    console.log("stop");
  }, 1000000);
}

function handleSampleDataQueryResponse(response) {
  if (response.isError()) {
    alert(
      "Error in query: " +
        response.getMessage() +
        " " +
        response.getDetailedMessage()
    );
    return;
  }

  var otherData = response.getDataTable();
  var ganttData = new google.visualization.DataTable({
    cols: [
      { type: "string", label: "id" },
      { type: "string", label: "Имя" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Начато" },
      { type: "date", label: "Завершено" },
      { type: "number", label: "Длительность" },
      { type: "number", label: "% Завершенно" },
      { type: "string", label: "Зависимость" },
    ],
  });

  for (var i = 0; i < otherData.getNumberOfRows(); i++) {
    let inprocess = 1; // otherData.getValue(i, 4)?otherData.getValue(i, 4):new Date();
    ganttData.addRow([
      otherData.getValue(i, 0),
      otherData.getValue(i, 1),
      otherData.getValue(i, 2),
      otherData.getValue(i, 3),
      otherData.getValue(i, 4),
      otherData.getValue(i, 5),
      otherData.getValue(i, 6),
      otherData.getValue(i, 7),
    ]);
  }

  var options = {
    height: 900,
    tooltip: { isHtml: true },
    gantt: {
      sortTasks: false,
      defaultStartDate: new Date(2022, 3, 28),
      arrow: { color: "#55555555" },
      palette: [
        {
          color: "#ccc",
          dark: "#f98e3d",
          light: "#eee",
        },
      ],
    },
  };
  var chart = new google.visualization.Gantt(
    document.getElementById("chart_div")
  );
  chart.draw(ganttData, options);
}
