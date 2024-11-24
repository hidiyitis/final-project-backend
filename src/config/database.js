import { PrismaClient } from "@prisma/client";
import log from "../utils/logger/logger.js";

export const prismaClient = new PrismaClient({
  log: [
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'query', emit: 'event'},
    { level: 'warn', emit: 'event' },
  ],
})

prismaClient.$on('error', (e)=>{
  log.logger.error(e)
})
prismaClient.$on('info', (e)=>{
  log.logger.info(e)
})
prismaClient.$on('query', (e)=>{
  log.logger.info(e)
})
prismaClient.$on('warn', (e)=>{
  log.logger.warn(e)
})