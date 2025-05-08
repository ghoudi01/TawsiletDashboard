import actions from "./actions";
import chartContent from "../../demoData/dashboardChartContent.json";
import { useSelector } from "react-redux";
import axios from "axios";

const {
  forcastOverview,
  youtubeSubscribe,
  SocialTrafficMetrics,
  twitterOverview,
  instagramOverview,
  linkdinOverview,
  cashFlow,
  income,
  performance,
  trafficChanel,
  device,
  region,
  generated,
  topSale,
  location,
  closedDeals,
  recentDeal,
} = chartContent;

const {
  forcastOverviewBegin,
  forcastOverviewSuccess,
  forcastOverviewErr,

  twitterOverviewBegin,
  twitterOverviewSuccess,
  twitterOverviewErr,

  linkdinOverviewBegin,
  linkdinOverviewSuccess,
  linkdinOverviewErr,

  instagramOverviewBegin,
  instagramOverviewSuccess,
  instagramOverviewErr,

  youtubeSubscribeBegin,
  youtubeSubscribeSuccess,
  youtubeSubscribeErr,

  closeDealBegin,
  closeDealSuccess,
  closeDealErr,

  recentDealBegin,
  recentDealSuccess,
  recentDealErr,

  socialTrafficBegin,
  socialTrafficSuccess,
  socialTrafficErr,

  cashFlowBegin,
  cashFlowSuccess,
  cashFlowErr,

  incomeBegin,
  incomeSuccess,
  incomeErr,

  performanceBegin,
  performanceSuccess,
  performanceErr,

  updateLoadingBegin,
  updateLoadingSuccess,
  updateLoadingErr,

  trafficChanelBegin,
  trafficChanelSuccess,
  trafficChanelErr,

  deviceBegin,
  deviceSuccess,
  deviceErr,

  landingPageBegin,
  landingPageSuccess,
  landingPageErr,

  regionBegin,
  regionSuccess,
  regionErr,

  generatedBegin,
  generatedSuccess,
  generatedErr,

  topSaleBegin,
  topSaleSuccess,
  topSaleErr,

  locationBegin,
  locationSuccess,
  locationErr,
} = actions;

const forcastOverviewGetData = () => {
  return async (dispatch) => {
    const { today } = forcastOverview;
    try {
      dispatch(forcastOverviewBegin());
      dispatch(forcastOverviewSuccess(today));
    } catch (err) {
      dispatch(forcastOverviewErr(err));
    }
  };
};

const forcastOverviewFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(forcastOverviewBegin());
      setTimeout(() => {
        dispatch(forcastOverviewSuccess(forcastOverview[value]));
      }, 100);
    } catch (err) {
      dispatch(forcastOverviewErr(err));
    }
  };
};

const youtubeSubscribeGetData = () => {
  return async (dispatch) => {
    const { year } = youtubeSubscribe;
    try {
      dispatch(youtubeSubscribeBegin());
      dispatch(youtubeSubscribeSuccess(year));
    } catch (err) {
      dispatch(youtubeSubscribeErr(err));
    }
  };
};

const youtubeSubscribeFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(youtubeSubscribeBegin());
      setTimeout(() => {
        dispatch(youtubeSubscribeSuccess(youtubeSubscribe[value]));
      }, 100);
    } catch (err) {
      dispatch(youtubeSubscribeErr(err));
    }
  };
};

const closeDealGetData = () => {
  return async (dispatch) => {
    const { year } = closedDeals;
    try {
      dispatch(closeDealBegin());
      dispatch(closeDealSuccess(year));
    } catch (err) {
      dispatch(closeDealErr(err));
    }
  };
};

const closeDealFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(closeDealBegin());
      setTimeout(() => {
        dispatch(closeDealSuccess(closedDeals[value]));
      }, 100);
    } catch (err) {
      dispatch(closeDealErr(err));
    }
  };
};

const recentDealGetData = () => {
  return async (dispatch) => {
    const { year } = recentDeal;
    try {
      dispatch(recentDealBegin());
      dispatch(recentDealSuccess(year));
    } catch (err) {
      dispatch(recentDealErr(err));
    }
  };
};

const recentDealFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(recentDealBegin());
      setTimeout(() => {
        dispatch(recentDealSuccess(recentDeal[value]));
      }, 100);
    } catch (err) {
      dispatch(recentDealErr(err));
    }
  };
};

const socialTrafficGetData = () => {
  return async (dispatch) => {
    const { today } = SocialTrafficMetrics;
    try {
      dispatch(socialTrafficBegin());
      dispatch(socialTrafficSuccess(today));
    } catch (err) {
      dispatch(socialTrafficErr(err));
    }
  };
};

const socialTrafficFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(socialTrafficBegin());
      setTimeout(() => {
        dispatch(socialTrafficSuccess(SocialTrafficMetrics[value]));
      }, 100);
    } catch (err) {
      dispatch(socialTrafficErr(err));
    }
  };
};

const twitterOverviewGetData = () => {
  return async (dispatch) => {
    const { month } = twitterOverview;
    try {
      dispatch(twitterOverviewBegin());
      dispatch(twitterOverviewSuccess(month));
    } catch (err) {
      dispatch(twitterOverviewErr(err));
    }
  };
};

const twitterOverviewFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(twitterOverviewBegin());
      setTimeout(() => {
        dispatch(twitterOverviewSuccess(twitterOverview[value]));
      }, 100);
    } catch (err) {
      dispatch(twitterOverviewErr(err));
    }
  };
};

const instagramOverviewGetData = () => {
  return async (dispatch) => {
    const { month } = instagramOverview;
    try {
      dispatch(instagramOverviewBegin());
      dispatch(instagramOverviewSuccess(month));
    } catch (err) {
      dispatch(instagramOverviewErr(err));
    }
  };
};

const instagramOverviewFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(instagramOverviewBegin());
      setTimeout(() => {
        dispatch(instagramOverviewSuccess(instagramOverview[value]));
      }, 100);
    } catch (err) {
      dispatch(instagramOverviewErr(err));
    }
  };
};

const linkdinOverviewGetData = () => {
  return async (dispatch) => {
    const { month } = linkdinOverview;
    try {
      dispatch(linkdinOverviewBegin());
      dispatch(linkdinOverviewSuccess(month));
    } catch (err) {
      dispatch(linkdinOverviewErr(err));
    }
  };
};

const linkdinOverviewFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(linkdinOverviewBegin());
      setTimeout(() => {
        dispatch(linkdinOverviewSuccess(linkdinOverview[value]));
      }, 100);
    } catch (err) {
      dispatch(linkdinOverviewErr(err));
    }
  };
};

const cashFlowGetData = () => {
  return async (dispatch) => {
    const { year } = cashFlow;
    try {
      dispatch(cashFlowBegin());
      dispatch(cashFlowSuccess(year));
    } catch (err) {
      dispatch(cashFlowErr(err));
    }
  };
};

const cashFlowFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(cashFlowBegin());
      setTimeout(() => {
        dispatch(cashFlowSuccess(cashFlow[value]));
      }, 100);
    } catch (err) {
      dispatch(cashFlowErr(err));
    }
  };
};

const incomeGetData = () => {
  return async (dispatch) => {
    const { year } = income;
    try {
      dispatch(incomeBegin());
      dispatch(incomeSuccess(year));
    } catch (err) {
      dispatch(incomeErr(err));
    }
  };
};

const incomeFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(incomeBegin());
      setTimeout(() => {
        dispatch(incomeSuccess(income[value]));
      }, 100);
    } catch (err) {
      dispatch(incomeErr(err));
    }
  };
};

const performanceGetData = (id) => {
  // console.log(id, "eeeeezzzzzzzzzzz");
  return async (dispatch) => {
    const { year } = performance;
    try {
      dispatch(performanceBegin());
      dispatch(performanceFilterData({ value: "year", id: id }));
    } catch (err) {
      dispatch(performanceErr(err));
    }
  };
};

const performanceFilterData = ({ value, id }) => {
  // console.log(id, value, "eeeeeeeeee");
  return async (dispatch) => {
    function extractCommandArrays(commands) {
      // Get current date and relevant information
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Get the current month (1-12)
      const currentDay = currentDate.getDate(); // Get the current day (1-31)
      const currentWeekDay = currentDate.getDay(); // Get the current weekday (0-6)

      // Initialize arrays and objects for the current month
      const commandsThisMonth = [];
      const totalPricesPerDay = Array(31).fill(0); // 31 days, initialized with 0
      const days = [];

      // Initialize arrays and objects for the current week
      const commandsThisWeek = [];
      const totalPricePerDayThisWeek = Array(7).fill(0); // 7 days, initialized with 0
      const daysWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Initialize arrays and objects for the current year
      const commandsThisYear = [];
      const totalPricePerMonthThisYear = Array(12).fill(0); // 12 months, initialized with 0
      const monthsThisYear = [];

      // Initialize arrays and objects for last month
      const commandsLastMonth = [];
      const totalPricesPerDayLastMonth = Array(31).fill(0);
      const daysLastMonth = [];

      // Initialize arrays and objects for last week and last year
      const commandsLastWeek = [];
      const totalPricePerDayLastWeek = Array(7).fill(0);
      const totalPricePerDayTwoWeekAgo = Array(7).fill(0);

      const daysLastWeek = [];

      // Initialize arrays and objects for last year and last two years
      const commandsLastYear = [];
      const totalPricePerMonthLastYear = Array(12).fill(0);
      const totalPricePerMonthLastTwoYears = Array(12).fill(0);

      // Create objects to keep track of total prices for each day in the month and month in the year
      const totalPriceByDay = {};
      const totalPriceByMonth = {};
      const totalPriceByLastMonth = {};
      const totalPriceByTwoMonthsAgo = {};

      // Calculate the date for two months ago
      const twoMonthsAgo = new Date(currentYear, currentMonth - 2, currentDay);

      // Calculate the start date for "this week"
      const startDateThisWeek = new Date(currentDate);
      startDateThisWeek.setDate(currentDate.getDate() - currentWeekDay);

      // Calculate the end date for "this week"
      const endDateThisWeek = new Date(currentDate);
      endDateThisWeek.setDate(currentDate.getDate() + (6 - currentWeekDay));

      // Calculate the start date for the previous week
      const startDateLastWeek = new Date(currentDate);
      startDateLastWeek.setDate(currentDate.getDate() - currentWeekDay - 7); // Go back 7 days

      // Calculate the end date for the previous week
      const endDateLastWeek = new Date(currentDate);
      endDateLastWeek.setDate(currentDate.getDate() - currentWeekDay - 1); // Go back 1 day

      // Calculate the start date for "two weeks ago"
      const startDateTwoWeeksAgo = new Date(currentDate);
      startDateTwoWeeksAgo.setDate(currentDate.getDate() - currentWeekDay - 14);

      // Calculate the end date for "two weeks ago"
      const endDateTwoWeeksAgo = new Date(currentDate);
      endDateTwoWeeksAgo.setDate(currentDate.getDate() - currentWeekDay - 8); // 7 days before "two weeks ago" start

      for (const command of commands) {
        const { Id, attributes } = command;
        const { departDate, totalPrice } = attributes;

        const departDateObject = new Date(departDate);
        const commandYear = departDateObject.getFullYear();
        const commandMonth = departDateObject.getMonth() + 1; // Get the month of the departDate
        const commandDay = departDateObject.getDate();
        const commandWeekDay = departDateObject.getDay();

        if (commandYear === currentYear) {
          commandsThisYear.push(command);

          if (commandMonth === currentMonth) {
            // Command is in the current month
            commandsThisMonth.push(command);

            // Extract the day portion of the departDate
            const day = departDateObject.getDate();

            // Accumulate the total prices for each day in the month
            totalPriceByDay[day] = (totalPriceByDay[day] || 0) + totalPrice;
          }

          if (
            departDateObject >= startDateThisWeek &&
            departDateObject <= endDateThisWeek
          ) {
            // Command is in the current week
            commandsThisWeek.push(command);

            // Accumulate the total prices for each day of the week
            const weekDayIndex = commandWeekDay; // 0-based index
            totalPricePerDayThisWeek[weekDayIndex] =
              (totalPricePerDayThisWeek[weekDayIndex] || 0) + totalPrice;
          }

          if (
            departDateObject >= startDateLastWeek &&
            departDateObject <= endDateLastWeek
          ) {
            commandsLastWeek.push(command);

            const weekDayIndex = commandWeekDay;
            totalPricePerDayLastWeek[weekDayIndex] =
              (totalPricePerDayLastWeek[weekDayIndex] || 0) + totalPrice;
          }
          if (
            departDateObject >= startDateTwoWeeksAgo &&
            departDateObject <= endDateTwoWeeksAgo
          ) {
            commandsLastWeek.push(command);

            const weekDayIndex = commandWeekDay;
            totalPricePerDayLastWeek[weekDayIndex] =
              (totalPricePerDayLastWeek[weekDayIndex] || 0) + totalPrice;
          }
        }

        if (commandYear === currentYear) {
          // Accumulate the total prices for each month in the current year
          totalPriceByMonth[commandMonth] =
            (totalPriceByMonth[commandMonth] || 0) + totalPrice;
        }

        if (commandYear === currentYear - 1) {
          // Accumulate the total prices for each month in the last year
          totalPriceByLastMonth[commandMonth] =
            (totalPriceByLastMonth[commandMonth] || 0) + totalPrice;
        }

        // Check for last month, last week, and last year
        const lastYear = currentMonth - 1 === 0 ? currentYear - 1 : currentYear;

        if (commandYear === lastYear) {
          commandsLastYear.push(command);
        }
      }

      // Ensure that there is an entry for every day in the current month
      const lastDayOfThisMonth = new Date(
        currentYear,
        currentMonth,
        0
      ).getDate();

      for (let i = 1; i <= lastDayOfThisMonth; i++) {
        days.push(i);
        totalPricesPerDay[i] = totalPriceByDay[i] || 0;
      }

      // Ensure that there is an entry for every month in the current year
      for (let month = 1; month <= 12; month++) {
        monthsThisYear.push(month);
        totalPricePerMonthThisYear[month - 1] = totalPriceByMonth[month] || 0;
        totalPricePerMonthLastYear[month - 1] =
          totalPriceByLastMonth[month] || 0; // Last year
        totalPricePerMonthLastTwoYears[month - 1] =
          totalPriceByTwoMonthsAgo[month] || 0;
      }

      // Ensure that there is an entry for every day in the last month
      const lastDayOfLastMonth = new Date(
        currentYear,
        currentMonth - 1,
        0
      ).getDate();

      for (let i = 1; i <= lastDayOfLastMonth; i++) {
        daysLastMonth.push(i);
        totalPricesPerDayLastMonth[i] = totalPriceByLastMonth[i] || 0;
      }

      const lastTwoMonthsAgo = new Date(currentYear, currentMonth - 2, 0);
      const lastDayOfLastTwoMonthsAgo = lastTwoMonthsAgo.getDate();
      const commandsLastTwoMonthsAgo = [];
      const totalPricesPerDayLastTwoMonthsAgo = Array(
        lastDayOfLastTwoMonthsAgo
      ).fill(0);
      const daysLastTwoMonthsAgo = [];
      const daysLastTwoMonth = [];
      for (let i = 1; i <= lastDayOfLastTwoMonthsAgo; i++) {
        daysLastTwoMonth.push(i);
        totalPricesPerDayLastTwoMonthsAgo[i] =
          totalPricesPerDayLastTwoMonthsAgo[i] || 0;
      }

      return {
        commandsThisMonth,
        totalPricesPerDay,
        days,
        daysWeek,
        commandsThisWeek,
        totalPricePerDayThisWeek,
        commandsThisYear,
        totalPricePerMonthThisYear,
        monthsThisYear,
        commandsLastMonth,
        totalPricesPerDayLastMonth,
        daysLastMonth,
        commandsLastWeek,
        totalPricePerDayLastWeek,
        daysLastWeek,
        commandsLastYear,
        totalPricePerMonthLastYear,
        // monthsLastYear,
        totalPricePerMonthLastTwoYears,
        totalPricePerDayTwoWeekAgo,
        totalPricesPerDayLastTwoMonthsAgo,
      };
    }

    function filterValidDays(array) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Month is 0-based, so we add 1 to get the current month

      // Get the last day of the current month
      const lastDayOfCurrentMonth = new Date(
        currentYear,
        currentMonth,
        0
      ).getDate();

      // Set the date to the last day of the current week
      // currentDate.setDate(currentDate.getDate() + daysUntilEndOfWeek);

      // Filter the array to include only valid day numbers
      return array.filter(
        (dayNumber) => dayNumber >= 1 && dayNumber <= lastDayOfCurrentMonth
      );
    }

    try {
      dispatch(performanceBegin());
      const jwt = localStorage.getItem("token");

      const response = id
        ? await axios.get(
            `${process.env.REACT_APP_BACKUP_URL}commands?pLevel=1&filters[$and][0][commandStatus]=Completed&pagination[limit]=9999999&sort[0]=departDate:desc&filters[$and][1][company_id][id][$eq]=${id}`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )
        : await axios.get(
            `${process.env.REACT_APP_BACKUP_URL}commands?pLevel=1&filters[commandStatus]=Completed&pagination[limit]=9999999&sort[0]=departDate:desc`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );

      const {
        commandsThisMonth,
        totalPricesPerDay,
        days,
        commandsThisWeek,
        totalPricePerDayThisWeek,
        daysWeek,
        commandsThisYear,
        totalPricePerMonthThisYear,
        monthsThisYear,
        commandsLastMonth,
        totalPricesPerDayLastMonth,
        daysLastMonth,
        commandsLastWeek,
        totalPricePerDayLastWeek,
        daysLastWeek,
        commandsLastYear,
        totalPricePerMonthLastYear,

        totalPricePerMonthLastTwoYears,
        totalPricePerDayTwoWeekAgo,
        totalPricesPerDayLastTwoMonthsAgo,
      } = extractCommandArrays(response?.data?.data);

      let dateNow = new Date();
      // Get the year, month, and day from the parsed date
      const year = dateNow.getFullYear();
      const month = (dateNow.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const day = dateNow.getDate().toString().padStart(2, "0");
      // Create the formatted date string
      const formattedDate = `${year}-${month}-${day}`;

      // Calculate the start and end dates for the current week (Monday to Sunday)
      const firstDayOfWeek = new Date(dateNow);
      firstDayOfWeek.setDate(
        dateNow.getDate() - ((dateNow.getDay() - 1 + 7) % 7)
      );
      const lastDayOfWeek = new Date(dateNow);
      lastDayOfWeek.setDate(dateNow.getDate() + (7 - dateNow.getDay()));

      // Calculate the start and end dates for the past week (Monday to Sunday)
      const lastMonday = new Date(dateNow);
      lastMonday.setDate(
        dateNow.getDate() - ((dateNow.getDay() - 1 + 7) % 7) - 7
      );
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);

      let totalThisMonth = response.data.data
        .filter(
          (el) =>
            (new Date(el?.departDate).getMonth() + 1)
              .toString()
              .padStart(2, "0") === month
        )
        .reduce((acc, obj) => acc + obj.totalPrice, 0);

      let totalLastMonth = response.data.data
        .filter(
          (el) =>
            (new Date(el?.departDate).getMonth() + 1)
              .toString()
              .padStart(2, "0") ===
            dateNow.getMonth().toString().padStart(2, "0")
        )
        .reduce((acc, obj) => acc + obj.totalPrice, 0);

      let totalThisYear = response.data.data
        .filter(
          (el) => new Date(el?.departDate).getFullYear() === year
        )
        .reduce((acc, obj) => acc + obj.totalPrice, 0);

      let totalLastYear = response.data.data
        .filter(
          (el) =>
            new Date(el?.departDate).getFullYear() ===
            dateNow.getFullYear() - 1
        )
        .reduce((acc, obj) => acc + obj.totalPrice, 0);

      let totalThisWeek = response.data.data
        .filter((record) => {
          const departDate = new Date(record.departDate);
          return departDate >= firstDayOfWeek && departDate <= lastDayOfWeek;
        })
        .reduce((acc, obj) => acc + obj.totalPrice, 0);

      let totalLastWeek = response.data.data
        .filter((record) => {
          const departDate = new Date(record.departDate);
          return departDate >= lastMonday && departDate <= lastSunday;
        })
        .reduce((acc, obj) => acc + obj.totalPrice, 0);
      // console.log("response", response.data.data);
      let calcul = {
        week: {
          users: [
            totalThisWeek.toString(), //affichage ce mois total
            totalPricePerDayThisWeek, //tab when ce mois
            totalPricePerDayLastWeek,
          ],
          sessions: [
            totalLastWeek.toString(),
            totalPricePerDayLastWeek, // tab when last month
            totalPricePerDayTwoWeekAgo,
          ],
          labels: [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche",
          ],
          // bounce: [
          //   "26.3%",
          //   [40, 30, 35, 35, 30, 30, 25],
          //   [20, 30, 25, 25, 40, 30, 25],
          // ],
          // duration: [
          //   "2m 18s",
          //   [40, 35, 35, 30, 25, 25, 35],
          //   [30, 25, 35, 30, 30, 35, 30],
          // ],
        },
        month: {
          users: [
            totalThisMonth.toString(),
            totalPricesPerDay,
            totalPricesPerDayLastMonth,
          ],
          sessions: [
            totalLastMonth.toString(),
            totalPricesPerDayLastMonth,
            totalPricesPerDayLastTwoMonthsAgo,
          ],
          bounce: [
            "26.3%",
            [35, 35, 45, 42, 65, 60, 42, 45, 35, 55, 40, 30],
            [20, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 25],
          ],
          duration: [
            "2m 18s",
            [65, 35, 45, 42, 65, 60, 42, 45, 35, 55, 40, 65],
            [45, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 55],
          ],
          labels: filterValidDays([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
          ]),
        },
        year: {
          users: [
            totalThisYear.toString(),
            totalPricePerMonthThisYear,
            totalPricePerMonthLastYear,
          ],
          sessions: [
            totalLastYear.toString(),
            totalPricePerMonthLastYear,
            totalPricePerMonthLastTwoYears,
          ],
          bounce: [
            "26.3%",
            [35, 35, 45, 42, 65, 60, 42, 45, 35, 55, 40, 30],
            [20, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 25],
          ],
          duration: [
            "2m 18s",
            [65, 35, 45, 42, 65, 60, 42, 45, 35, 55, 40, 65],
            [45, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 55],
          ],
          labels: [
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sep",
            "Oct",
            "Nov",
            "Déc",
          ],
        },
      };
      // JSON.stringify(calcul, null, 2)
      setTimeout(() => {
        // console.log(
        //   "totalPricePerMonthLastTwoYears:",
        //   totalPricePerDayLastWeek,
        //   totalPricePerDayThisWeek
        // );

        dispatch(performanceSuccess(calcul[value]));
      }, 100);
    } catch (err) {
      dispatch(performanceErr(err));
    }
  };
};

const trafficChanelGetData = () => {
  return async (dispatch) => {
    const { year } = trafficChanel;
    try {
      dispatch(trafficChanelBegin());
      dispatch(trafficChanelSuccess(year));
    } catch (err) {
      dispatch(trafficChanelErr(err));
    }
  };
};

const trafficChanelFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(trafficChanelBegin());
      setTimeout(() => {
        dispatch(trafficChanelSuccess(trafficChanel[value]));
      }, 100);
    } catch (err) {
      dispatch(trafficChanelErr(err));
    }
  };
};

const deviceGetData = () => {
  return async (dispatch) => {
    const { year } = device;
    try {
      dispatch(deviceBegin());
      dispatch(deviceSuccess(year));
    } catch (err) {
      dispatch(deviceErr(err));
    }
  };
};

const deviceFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(deviceBegin());
      setTimeout(() => {
        dispatch(deviceSuccess(device[value]));
      }, 100);
    } catch (err) {
      dispatch(deviceErr(err));
    }
  };
};

const setIsLoading = () => {
  return async (dispatch) => {
    try {
      dispatch(updateLoadingBegin());
      setTimeout(() => {
        dispatch(updateLoadingSuccess());
      }, 100);
    } catch (err) {
      dispatch(updateLoadingErr(err));
    }
  };
};

const landingPageGetData = () => {
  return async (dispatch) => {
    const { year } = trafficChanel;
    try {
      dispatch(landingPageBegin());
      dispatch(landingPageSuccess(year));
    } catch (err) {
      dispatch(landingPageErr(err));
    }
  };
};

const landingPageFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(landingPageBegin());
      setTimeout(() => {
        dispatch(landingPageSuccess(trafficChanel[value]));
      }, 100);
    } catch (err) {
      dispatch(landingPageErr(err));
    }
  };
};

const regionGetData = () => {
  return async (dispatch) => {
    const { year } = region;
    try {
      dispatch(regionBegin());
      dispatch(regionSuccess(year));
    } catch (err) {
      dispatch(regionErr(err));
    }
  };
};

const regionFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(regionBegin());
      setTimeout(() => {
        dispatch(regionSuccess(region[value]));
      }, 100);
    } catch (err) {
      dispatch(regionErr(err));
    }
  };
};

const generatedGetData = () => {
  return async (dispatch) => {
    const { year } = generated;
    try {
      dispatch(generatedBegin());
      dispatch(generatedSuccess(year));
    } catch (err) {
      dispatch(generatedErr(err));
    }
  };
};

const generatedFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(generatedBegin());
      setTimeout(() => {
        dispatch(generatedSuccess(generated[value]));
      }, 100);
    } catch (err) {
      dispatch(generatedErr(err));
    }
  };
};

const topSaleGetData = () => {
  return async (dispatch) => {
    const { year } = topSale;
    try {
      dispatch(topSaleBegin());
      dispatch(topSaleSuccess(year));
    } catch (err) {
      dispatch(topSaleErr(err));
    }
  };
};

const topSaleFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(topSaleBegin());
      setTimeout(() => {
        dispatch(topSaleSuccess(topSale[value]));
      }, 100);
    } catch (err) {
      dispatch(topSaleErr(err));
    }
  };
};

const locationGetData = () => {
  return async (dispatch) => {
    const { today } = location;
    try {
      dispatch(locationBegin());
      dispatch(locationSuccess(today));
    } catch (err) {
      dispatch(locationErr(err));
    }
  };
};

const locationFilterData = (value) => {
  return async (dispatch) => {
    try {
      dispatch(locationBegin());
      setTimeout(() => {
        dispatch(locationSuccess(location[value]));
      }, 100);
    } catch (err) {
      dispatch(locationErr(err));
    }
  };
};

export {
  locationGetData,
  locationFilterData,
  topSaleGetData,
  topSaleFilterData,
  generatedFilterData,
  generatedGetData,
  regionGetData,
  regionFilterData,
  landingPageFilterData,
  landingPageGetData,
  deviceFilterData,
  deviceGetData,
  trafficChanelGetData,
  trafficChanelFilterData,
  setIsLoading,
  performanceFilterData,
  performanceGetData,
  incomeGetData,
  incomeFilterData,
  forcastOverviewGetData,
  forcastOverviewFilterData,
  twitterOverviewGetData,
  twitterOverviewFilterData,
  youtubeSubscribeFilterData,
  youtubeSubscribeGetData,
  socialTrafficFilterData,
  socialTrafficGetData,
  instagramOverviewGetData,
  instagramOverviewFilterData,
  linkdinOverviewGetData,
  linkdinOverviewFilterData,
  cashFlowGetData,
  cashFlowFilterData,
  closeDealGetData,
  closeDealFilterData,
  recentDealGetData,
  recentDealFilterData,
};
