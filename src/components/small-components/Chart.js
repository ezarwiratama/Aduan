import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchMessages } from "../../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ dateRange }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [maxYValue, setMaxYValue] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchMessages();
        const messages = response.data;

        const dateStatusCount = {};

        messages.forEach((message) => {
          const date = moment(message.date).format("DD-MM-YYYY");
          const msgDate = moment(message.date);
          if (msgDate.isBetween(dateRange[0], dateRange[1], null, '[]')) {
            if (!dateStatusCount[date]) {
              dateStatusCount[date] = { pending: 0, process: 0, done: 0 };
            }
            dateStatusCount[date][message.status]++;
          }
        });

        const labels = Object.keys(dateStatusCount);
        const pendingData = labels.map((date) => dateStatusCount[date].pending);
        const processData = labels.map((date) => dateStatusCount[date].process);
        const doneData = labels.map((date) => dateStatusCount[date].done);

        const totalPending = pendingData.reduce((a, b) => a + b, 0);
        const totalProcess = processData.reduce((a, b) => a + b, 0);
        const totalDone = doneData.reduce((a, b) => a + b, 0);

        const maxDataValue = Math.max(totalPending, totalProcess, totalDone);
        setMaxYValue(maxDataValue + 10); // Update maxYValue

        setChartData({
          labels,
          datasets: [
            {
              label: `Aduan Masuk`,
              data: pendingData,
              backgroundColor: "#FA5A7E",
              borderColor: "#FA5A7E",
            },
            {
              label: `Aduan Diproses`,
              data: processData,
              backgroundColor: "#FF947A",
              borderColor: "#FF947A",
            },
            {
              label: `Aduan Selesai`,
              data: doneData,
              backgroundColor: "#3CD856",
              borderColor: "#3CD856",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getData();
  }, [dateRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
            color: 'black'
          },
          boxWidth: 20,
          padding: 40, 
        },
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 2,
        },
        title: {
          display: true,
          text: 'Banyaknya Aduan',
          font: {
            family: "'Poppins', sans-serif",
          },
        },
        max: maxYValue,
      },
      x: {
        title: {
          display: true,
          text: 'Tanggal Aduan',
          font: {
            family: "'Poppins', sans-serif",
          },
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default Chart;
