import React from "react";
import { Chart } from "react-google-charts";

const RepoChart = ({ commitData }) => {
  console.log("Comits", commitData);
  const options = {
    title: commitData
      ? `Total Commits: ${commitData.totalCommits}`
      : "Loading...",
    pieHole: 0.4,
    is3D: true,
    pieStartAngle: 100,
    sliceVisibilityThreshold: 0.02,
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
  };

  // Transform commit data into Google Charts format
  const transformCommitData = () => {
    // Start with header row
    const chartData = [["Contributor", "Commits"]];

    // If commitData exists and has commitsByCommitter
    if (commitData?.commitsByCommitter) {
      Object.entries(commitData.commitsByCommitter).forEach(
        ([committer, count]) => {
          // Extract username from email format
          const username = committer.split(" (")[0];
          chartData.push([username, count]);
        }
      );
    }

    return chartData;
  };

  return (
    <div className="rounded-md z-50">
      <Chart
      className="rounded-md"
        chartType="PieChart"
        data={transformCommitData()}
        options={options}
        //   width={"100%"}
        height={"400px"}
      />
    </div>
  );
};

export default RepoChart;
