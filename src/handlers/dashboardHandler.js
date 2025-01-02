import dashboardService from "../services/dashboardService.js";
import wrapper from "../utils/helpers/wrapper.js";
import httpCode from "../utils/constant/httpCode.js";

const getDashboardCard = async (req, res) => {
  try {
    const result = await dashboardService.getDashboardCard();

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch dashboard card data",
        httpCode.INTERNAL_SERVER
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Success fetching dashboard card data",
      httpCode.OK
    );
  } catch (error) {
    console.error("Dashboard Card Handler Error:", error);
    return wrapper.response(
      res,
      "fail",
      null,
      "Internal server error",
      httpCode.INTERNAL_SERVER
    );
  }
};

const getDashboardChart = async (req, res) => {
  try {
    const result = await dashboardService.getDashboardChart();

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to fetch dashboard chart data",
        httpCode.INTERNAL_SERVER
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Success fetching dashboard chart data",
      httpCode.OK
    );
  } catch (error) {
    console.error("Dashboard Chart Handler Error:", error);
    return wrapper.response(
      res,
      "fail",
      null,
      "Internal server error",
      httpCode.INTERNAL_SERVER
    );
  }
};

export default {
  getDashboardCard,
  getDashboardChart,
};
