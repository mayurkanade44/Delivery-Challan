import { Chart as ChartJS, Title, defaults, scales } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
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
        <div className="mx-2 md:mx-10 mb-2 lg:py-2 grid lg:grid-cols-2 gap-x-2 gap-y-5">
          <div className="bg-white border border-black ">
            <div className="p-1">
              <h2 className="text-center text-lg my-1 font-medium">
                Cash Collection
              </h2>
              <Bar
                height={"200px"}
                data={{
                  labels: data.cashData?.map((data) => data.label),
                  datasets: [
                    {
                      label: "Amount",
                      data: data.cashData?.map((data) => data.value),
                      backgroundColor: [
                        "gray",
                        "green",
                        "red",
                        "rgba(255, 99, 71, 1)",
                        "rgba(43, 63, 229, 1)",
                        "pink",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div className="bg-white border border-black">
            <div className="p-1">
              <h2 className="text-center text-lg my-1 font-medium">
                Bill Collection
              </h2>
              <Bar
                height={"200px"}
                data={{
                  labels: data.cashData?.map((data) => data.label),
                  datasets: [
                    {
                      label: "Amount",
                      data: data.billData?.map((data) => data.value),
                      backgroundColor: [
                        "gray",
                        "green",
                        "red",
                        "rgba(255, 99, 71, 1)",
                        "rgba(43, 63, 229, 1)",
                        "pink",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div className=" bg-white border border-black">
            <div className="p-1">
              <h2 className="text-center text-lg my-1 font-medium">
                Single Service Slips
              </h2>
              <Bar
                height={"200px"}
                data={{
                  labels: data.slipData?.map((data) => data.label),
                  datasets: [
                    {
                      label: "Slips",
                      data: data.slipData?.map((data) => data.value),
                      backgroundColor: [
                        "rgba(60, 60, 60, 0.7)",
                        "rgba(43, 63, 229, 1)",
                        "rgba(60, 179, 113, 1)",
                        "rgba(255, 165, 0, 1)",
                        "rgba(43, 63, 229, 1)",
                        "rgba(255, 99, 71, 1)",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
