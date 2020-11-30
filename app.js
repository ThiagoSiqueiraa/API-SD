const mqtt = require('mqtt')
const cors = require('cors')
const express = require('express')
const app = express()
const { QueryTypes } = require('sequelize');
const { sequelize } = require('./app/models');
const server = require('http').createServer(app)
const io = require('./socket-io').initialize(server);
const MqttHandler = require('./MqttHandler')

const corsOptions = { 
  origin: "*", 
  credentials: true 
};


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsOptions)); 

io.on('connection', (socket) => {

  console.log("Conectado Socket.io")
 
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.username, event: 'left'});   
  });
 
  socket.on('set-name', (name) => {
    console.log(name)

  });
  
  socket.on('send-message', (message) => {
    io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });
});

const mqttClient = new MqttHandler()
mqttClient.connect()

app.post("/send-mqtt", function(req, res) {
  mqttClient.sendMessage('dht11', req.body.message);

  res.status(200).send("Message sent to mqtt");
});

app.get("/get/average/week/temperature", async (req, res) => {
  const averageWeek = await sequelize.query(`SELECT COUNT(*), DAY(createdAt) as day, MONTH(createdAt) as month, YEAR(createdAt) as year, AVG(temperature) as temp, AVG(umidity) as umidity, MIN(createdAt) FROM monitoramento.sensor_data 
  WHERE YEARWEEK(createdAt)=YEARWEEK(NOW())
  GROUP BY DAY(createdAt), MONTH(createdAt), YEAR(createdAt)
  ORDER BY MIN(createdAt)
  `, {type: QueryTypes.SELECT})
  
  let label = []
  let averages = []
  averageWeek.forEach((item, index) => {
    label.push(`${item.day}/${item.month}/${item.year}`)
    averages.push({"temp": item.temp, "umidity": item.umidity})

  })

  res.send({
    label,
    averages
  })
})

server.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

