
import React from "react";
import SavingsGoal from "./SavingsGoal";

const SavingGoals = () => {
  // Example savings goals data
  const goals = [
    { name: "Emergency Fund", target: 2000, current: 1200 },
    { name: "Vacation", target: 1500, current: 1600 },
    { name: "New Laptop", target: 1000, current: 400 },
  ];

  return (
    <div>
      <h2>Saving Goals</h2>
      {goals.map((goal, idx) => (
        <div key={goal.name} style={{ marginBottom: 24 }}>
          <SavingsGoal
            name={goal.name}
            target={goal.target}
            current={goal.current}
          />
        </div>
      ))}
    </div>
  );
};

export default SavingGoals;
