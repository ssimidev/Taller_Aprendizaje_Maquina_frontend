import { RadialBarChart, RadialBar } from "recharts";

export default function Gauge({ value }) {
  const data = [
    {
      name: "score",
      value,
      fill: value >= 7 ? "green" : value >= 4 ? "orange" : "red",
    },
  ];

  return (
    <RadialBarChart
      width={250}
      height={250}
      cx={125}
      cy={125}
      innerRadius="80%"
      outerRadius="100%"
      data={data}
      startAngle={180}
      endAngle={0}
    >
      <RadialBar clockWise dataKey="value" />
    </RadialBarChart>
  );
}
