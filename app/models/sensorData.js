module.exports = (sequelize, DataTypes) => {
  const SensorData = sequelize.define('SensorData', {
    temperature: DataTypes.NUMBER,
    umidity: DataTypes.NUMBER,
    soilmoisture: DataTypes.NUMBER,
  }, {
    tableName: 'sensor_data'
  });

  return SensorData;
}