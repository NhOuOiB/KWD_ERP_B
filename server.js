require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.SERVER_PORT || 3001;
const moment = require('moment');
const cookieParser = require('cookie-parser');

const http = require('http');
const server = http.createServer(app);

const login = require('./routers/login');
const hr = require('./routers/hr');
const Authentication = require('./middlewares/Authentication');

const corsOptions = {
  // 如果要讓 cookie 可以跨網域存取，這邊要設定 credentials
  // 且 origin 也要設定
  credentials: true,
  origin: ['http://localhost:5173', 'http://localhost:8000', 'http://192.168.1.106:8000'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Now：${moment().format('YYYY-MM-DD h:mm:ss')}`);
  next();
});

app.use('/', login);
app.use('/', hr);
app.use('/auth', Authentication);

server.listen(port, () => console.log('server is runing : ' + port));
