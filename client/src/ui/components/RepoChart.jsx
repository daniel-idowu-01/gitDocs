import React from "react";
import { Chart } from "react-google-charts";
import "../../index.css"

const RepoChart = ({ commitData }) => {
  console.log("Comits", commitData);
  const options = {
    title: commitData
      ? `Total Commits: ${commitData.totalCommits}`
      : "Loading...",
    titleTextStyle: {
      color: "#FFF",
      fontSize: 18,
      bold: true,
      italic: false,
      fontName: "Montserrat"
    },
    pieHole: 0.4,
    is3D: true,
    pieStartAngle: 100,
    backgroundColor: "transparent",
    sliceVisibilityThreshold: 0.02,
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#FFF",
        fontSize: 14,
        fontName: "Montserrat",
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
        chartType="PieChart"
        data={transformCommitData()}
        options={options}
        height={"700px"}
        width={"700px"}
      />
    </div>
  );
};

export default RepoChart;
