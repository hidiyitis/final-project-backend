import express from "express";
import userRouter from "./router/userRouter.js";
import logger from "./utils/logger/logger.js";
import wrapper from "./utils/helpers/wrapper.js";
import { NotFound } from "./utils/errors/NotFound.js";
import httpCode from "./utils/constant/httpCode.js";
import serviceRouter from "./router/serviceRouter.js";
const app = express();
const PORT = 9000

app.use(express.json())

app.get('/api/v1', (req, res)=>{
  res.end('OK!!!')
});

const routers = [userRouter, serviceRouter]

routers.forEach(e=> app.use('/api/v1', e.router))

app.use((req, res)=>{
  wrapper.response(res, 'fail', wrapper.error(new NotFound('Not Found')), '', httpCode.NOT_FOUND);
})

app.listen(PORT||9000,'0.0.0.0',()=>{
  const ctx = 'app-listen';
  logger.log(ctx, `App running at ${PORT||9000}`, 'initate application')
})
