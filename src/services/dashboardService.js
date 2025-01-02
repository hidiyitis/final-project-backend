import { prismaClient } from "../config/database.js";
import { InternalServer } from "../utils/errors/InternalServer.js";
import wrapper from "../utils/helpers/wrapper.js";

const getDashboardCard = async () => {
  try {
    const currentYear = new Date().getFullYear();

    const [totalEarnings, inProgressOrders, completedOrders] = await Promise.all([
      prismaClient.$queryRaw`
        SELECT 
          SUM("totalPrice") as totalEarnings
        FROM orders
        WHERE status = 'SELESAI' AND extract(year from date) = ${currentYear}
      `,
      prismaClient.order.count({
        where: {
          status: "SEDANG_DIKERJAKAN",
          date: {
            gte: new Date(`${currentYear}-01-01`),
            lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      }),
      prismaClient.order.count({
        where: {
          status: "SELESAI",
          date: {
            gte: new Date(`${currentYear}-01-01`),
            lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      }),
    ]);

    console.log(totalEarnings);
    const response = {
      totalEarnings: parseInt(totalEarnings[0]?.totalearnings) || 0,
      inProgressOrders,
      completedOrders,
    };

    return wrapper.data(response, "Success get dashboard card data");
  } catch (error) {
    console.error(error);
    return wrapper.error(new InternalServer(error));
  }
};

const getDashboardChart = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const [monthlyOrders, inProgressOrders, completedOrders] = await Promise.all([
      prismaClient.$queryRaw`
        SELECT 
            to_char(date, 'Month') AS month,
            COUNT(*) AS total
        FROM orders
        WHERE extract(year FROM date) = ${currentYear}
        GROUP BY to_char(date, 'Month'), extract(month FROM date)
        ORDER BY MONTH
      `,
      prismaClient.$queryRaw`
        SELECT 
          to_char(date, 'Month') as month,
          COUNT(*) as total
        FROM orders
        WHERE status = 'SEDANG_DIKERJAKAN' AND extract(year from date) = ${currentYear}
        GROUP BY MONTH
        ORDER BY MONTH
      `,
      prismaClient.$queryRaw`
        SELECT 
          to_char(date, 'Month') as month,
          COUNT(*) as total
        FROM orders
        WHERE status = 'SELESAI' AND extract(year from date) = ${currentYear}
        GROUP BY MONTH
        ORDER BY MONTH
      `,
    ]);

    const normalize = (data)=>{
        return data.map(e=>{
          return {
              month: e.month.trim,
              total :parseInt(e.total)
          }
        })
    }

  const response = {
    monthlyOrders: normalize(monthlyOrders),
    inProgressOrders: normalize(inProgressOrders),
    completedOrder: normalize(completedOrders),
  };

    return wrapper.data(response, "Success get dashboard chart data");
  } catch (error) {
    console.error(error);
    return wrapper.error(new InternalServer(error));
  }
};

export default {
  getDashboardCard,
  getDashboardChart,
};
