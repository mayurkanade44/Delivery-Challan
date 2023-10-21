import { Chart as ChartJS, Title, defaults } from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useChartDataQuery } from "../redux/challanSlice";
import { AlertMessage, Loading } from "../components";

defaults.responsive = true;

const Dashboard = () => {
  ChartJS.register(Title, ChartDataLabels);
  ChartJS.defaults.set("plugins.datalabels", {
    color: "black",
    font: { size: 16 },
  });

  const { data, isLoading: chartLoading, error } = useChartDataQuery();
  console.log(data);

  return (
    <div className="bg-slate-100">
      <h1 className="text-center text-lime-500 text-4xl font-semibold pt-16 pb-5 lg:py-2 ">
        Dashboard
      </h1>
      {chartLoading ? (
        <Loading />
      ) : (
        error && <AlertMessage>{error?.data?.msg || error.error}</AlertMessage>
      )}
      {data && (
        <div className="mx-10 lg:py-2">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="col-span-2 bg-white border border-black">
              <div className="p-1">
                <h2 className="text-center text-lg my-1 font-medium">
                  Delivery Challans
                </h2>
                <Bar
                  data={{
                    labels: data.barData?.map((data) => data.label),
                    datasets: [
                      {
                        label: "Challans",
                        data: data.barData?.map((data) => data.value),
                        backgroundColor: [
                          "rgba(60, 60, 60, 0.7)",
                          "rgba(43, 63, 229, 1)",
                          "rgba(60, 179, 113, 1)",
                          "rgba(255, 165, 0, 1)",
                          "rgba(43, 63, 229, 1)",
                          "rgba(255, 99, 71, 1)",
                        ],
                      },
                    ],
                  }}
                />
              </div>
            </div>
            <div className="bg-white  border border-black">
              <div className="p-1">
                <h2 className="text-center text-lg my-1 font-medium">
                  Amount Collection
                </h2>
                <Pie
                  data={{
                    labels: data.pieData?.map((data) => data.label),
                    datasets: [
                      {
                        label: "Amount",
                        data: data.pieData?.map((data) => data.value),
                        backgroundColor: [
                          "rgba(255, 0, 0, 1)",
                          "rgba(60, 179, 113, 1)",
                        ],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
