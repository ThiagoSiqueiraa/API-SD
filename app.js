const mqtt = require('mqtt')
const express = require('express')
const MqttHandler = require('./MqttHandler')
const app = express()
const { QueryTypes } = require('sequelize');
const { sequelize } = require('./app/models');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const mqttClient = new MqttHandler()
mqttClient.connect()

app.post("/send-mqtt", function(req, res) {
  mqttClient.sendMessage('dht11', req.body.message);

  res.status(200).send("Message sent to mqtt");
});

app.get("/get/average/week/temperature", async (req, res) => {
  const averageWeek = await sequelize.query(`SELECT COUNT(*), DAY(createdAt) as day, MONTH(createdAt) as month, YEAR(createdAt) as year, AVG(temperature) as temp, AVG(umidity), MIN(createdAt) as umidity FROM monitoramento.sensor_data 
  WHERE YEARWEEK(createdAt)=YEARWEEK(NOW())
  GROUP BY DAY(createdAt), MONTH(createdAt), YEAR(createdAt)
  ORDER BY MIN(createdAt)
  `, {type: QueryTypes.SELECT})
  let label = []
  let averages = []
  const data = averageWeek.forEach((item, index) => {
    label.push(`${item.day}/${item.month}/${item.year}`)
    averages.push(item.temp)

  })
  //console.log(data)
  //console.log(averageWeek)
  res.send({
    label,
    averages
  })
})

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

