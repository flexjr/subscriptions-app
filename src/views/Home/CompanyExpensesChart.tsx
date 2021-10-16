import { format, subDays } from "date-fns";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const date = new Date();

const data = [
  {
    spend: 10.5,
  },
  {
    spend: 8.5,
  },
  {
    spend: 12.45,
  },
  {
    spend: 15,
  },
  {
    spend: 10.5,
  },
  {
    spend: 5.8,
  },
  {
    spend: 12,
  },
];

export const CompanyExpensesChart: React.FunctionComponent = () => {
  const formattedData = data.map((item, i) => {
    return {
      spend: item.spend,
      date: format(subDays(date, 6 - i), "MMM d"),
    };
  });

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <AreaChart
          data={formattedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" axisLine={false} />
          <YAxis tickFormatter={(tick) => `SGD ${tick}`} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="spend" stroke="rgb(48, 231, 169)" fill="rgb(48, 231, 169, 0.5)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
