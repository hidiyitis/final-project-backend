
import { config } from "dotenv";
import { prismaClient } from "../src/config/database.js";
import { hash, genSalt } from "bcrypt";
import logger from "../src/utils/logger/logger.js";
config()

async function main() {
  const ctx = 'seeder'
  const salt = await genSalt(10);
  const encryptedPassword = await hash(process.env.DEFAULT_PASSWORD || 'password', salt);
  await prismaClient.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      username: 'admin',
      accessRole: 'SUPER_ADMIN',
      password: encryptedPassword
    },
  })
  logger.log(ctx, 'init super admin')
}
main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })