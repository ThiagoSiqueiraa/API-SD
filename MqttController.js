
const { SensorData } = require('./app/models');

const insert = async(message) => {
  const obj = JSON.parse(message)
  const isValidPayload = obj && obj.umidity && obj.temperature && obj.soilMisture
  if(isValidPayload){
    const {temperature, umidity, soilMisture} = obj
    await SensorData.create({ temperature, umidity, soilmoisture: soilMisture });
  
  }
}

module.exports = {
  insert
}