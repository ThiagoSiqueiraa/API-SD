const mqtt = require('mqtt')
const mqttController = require('./MqttController')
class MqttHandler{
  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://127.0.0.1';

  }

  connect(){
    this.mqttClient = mqtt.connect(this.host)

    this.mqttClient.on('error', (err) => {
      console.log(err)
      this.mqttClient.end();
    })

    //callback de conexão
    this.mqttClient.on('connect', () => {
      console.log("Cliente conectado no MQTT")
    })

    this.mqttClient.subscribe('dht11')

        // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log('received message %s %s', topic, message)
      switch (topic){
        case 'dht11':
          return mqttController.insert(message)
      }
      /*
      switch (topic) {
        case 'garage/open':
          return handleOpenRequest(message)
        case 'garage/close':
          return handleCloseRequest(message)
      }*/
    });

    this.mqttClient.on('close', () => {
      console.log('mqtt cliente desconectado')
    })


  }

  sendMessage(topic, message){
    this.mqttClient.publish(topic, message)
  }


}

module.exports = MqttHandler;