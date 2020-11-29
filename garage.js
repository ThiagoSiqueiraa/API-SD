const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1')

var connected = false

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
