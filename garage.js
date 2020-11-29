const mqttHandler = require('./MqttHandler')

var mqttClient = new mqttHandler();

mqttClient.connect()


/*
client.on('connect', () => {
  client.subscribe('dht11')
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'dht11':
      return handleDht11(message)
  }
  console.log('No handler for topic %s', topic)
})

function handleDht11 (message) {
  const objMessage = JSON.parse(message)
  console.log(objMessage)
  console.log('umidty: %s', objMessage.umidty)
  console.log('temperature: %s', objMessage.temperature)
  console.log('soil moisture: %s', objMessage.soilMoisture)
  connected = (message.toString() === 'true')
}

*/