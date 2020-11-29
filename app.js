const mqtt = require('mqtt')
const express = require('express')
const MqttHandler = require('./MqttHandler')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const mqttClient = new MqttHandler()
mqttClient.connect()

app.post("/send-mqtt", function(req, res) {
  mqttClient.sendMessage('dht11', req.body.message);
  res.status(200).send("Message sent to mqtt");
});

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});