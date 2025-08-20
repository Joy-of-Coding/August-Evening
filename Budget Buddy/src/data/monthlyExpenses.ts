export interface MonthlyExpense {
  id: string;
  category: string;
  name: string;
  amount: number;
  isFixed: boolean;
  description?: string;
  dueDate?: number; // Day of month (1-31)
}

export const monthlyExpenses: MonthlyExpense[] = [
  // Housing
  {
    id: "rent-mortgage",
    category: "Housing",
    name: "Rent/Mortgage",
    amount: 1200,
    isFixed: true,
    description: "Monthly housing payment",
    dueDate: 1
  },
  {
    id: "property-tax",
    category: "Housing",
    name: "Property Tax",
    amount: 200,
    isFixed: true,
    description: "Monthly property tax escrow",
    dueDate: 1
  },
  {
    id: "homeowners-insurance",
    category: "Housing",
    name: "Homeowners Insurance",
    amount: 100,
    isFixed: true,
    description: "Monthly insurance premium",
    dueDate: 1
  },
  {
    id: "hoa-fees",
    category: "Housing",
    name: "HOA Fees",
    amount: 150,
    isFixed: true,
    description: "Homeowners association fees",
    dueDate: 1
  },

  // Utilities
  {
    id: "electricity",
    category: "Utilities",
    name: "Electricity",
    amount: 120,
    isFixed: false,
    description: "Monthly electric bill",
    dueDate: 15
  },
  {
    id: "water-sewer",
    category: "Utilities",
    name: "Water & Sewer",
    amount: 80,
    isFixed: false,
    description: "Water and sewage services",
    dueDate: 20
  },
  {
    id: "gas",
    category: "Utilities",
    name: "Natural Gas",
    amount: 60,
    isFixed: false,
    description: "Gas heating and cooking",
    dueDate: 15
  },
  {
    id: "internet",
    category: "Utilities",
    name: "Internet",
    amount: 70,
    isFixed: true,
    description: "High-speed internet service",
    dueDate: 1
  },
  {
    id: "phone",
    category: "Utilities",
    name: "Phone Service",
    amount: 50,
    isFixed: true,
    description: "Mobile phone plan",
    dueDate: 1
  },
  {
    id: "cable-tv",
    category: "Utilities",
    name: "Cable TV",
    amount: 90,
    isFixed: true,
    description: "Cable television service",
    dueDate: 1
  },

  // Transportation
  {
    id: "car-payment",
    category: "Transportation",
    name: "Car Payment",
    amount: 350,
    isFixed: true,
    description: "Monthly car loan payment",
    dueDate: 15
  },
  {
    id: "car-insurance",
    category: "Transportation",
    name: "Car Insurance",
    amount: 120,
    isFixed: true,
    description: "Auto insurance premium",
    dueDate: 1
  },
  {
    id: "gas-fuel",
    category: "Transportation",
    name: "Gas/Fuel",
    amount: 200,
    isFixed: false,
    description: "Monthly fuel costs",
    dueDate: 25
  },
  {
    id: "public-transport",
    category: "Transportation",
    name: "Public Transportation",
    amount: 80,
    isFixed: true,
    description: "Monthly transit pass",
    dueDate: 1
  },
  {
    id: "parking",
    category: "Transportation",
    name: "Parking",
    amount: 60,
    isFixed: true,
    description: "Monthly parking permit",
    dueDate: 1
  },

  // Food & Groceries
  {
    id: "groceries",
    category: "Food",
    name: "Groceries",
    amount: 400,
    isFixed: false,
    description: "Weekly grocery shopping",
    dueDate: 30
  },
  {
    id: "dining-out",
    category: "Food",
    name: "Dining Out",
    amount: 200,
    isFixed: false,
    description: "Restaurants and takeout",
    dueDate: 30
  },
  {
    id: "coffee-snacks",
    category: "Food",
    name: "Coffee & Snacks",
    amount: 80,
    isFixed: false,
    description: "Daily coffee and snacks",
    dueDate: 30
  },

  // Healthcare
  {
    id: "health-insurance",
    category: "Healthcare",
    name: "Health Insurance",
    amount: 300,
    isFixed: true,
    description: "Monthly health insurance premium",
    dueDate: 1
  },
  {
    id: "dental-insurance",
    category: "Healthcare",
    name: "Dental Insurance",
    amount: 50,
    isFixed: true,
    description: "Monthly dental insurance premium",
    dueDate: 1
  },
  {
    id: "vision-insurance",
    category: "Healthcare",
    name: "Vision Insurance",
    amount: 25,
    isFixed: true,
    description: "Monthly vision insurance premium",
    dueDate: 1
  },
  {
    id: "prescriptions",
    category: "Healthcare",
    name: "Prescriptions",
    amount: 75,
    isFixed: false,
    description: "Monthly medication costs",
    dueDate: 30
  },

  // Insurance
  {
    id: "life-insurance",
    category: "Insurance",
    name: "Life Insurance",
    amount: 80,
    isFixed: true,
    description: "Monthly life insurance premium",
    dueDate: 1
  },
  {
    id: "disability-insurance",
    category: "Insurance",
    name: "Disability Insurance",
    amount: 60,
    isFixed: true,
    description: "Monthly disability insurance premium",
    dueDate: 1
  },

  // Debt Payments
  {
    id: "student-loans",
    category: "Debt",
    name: "Student Loans",
    amount: 250,
    isFixed: true,
    description: "Monthly student loan payment",
    dueDate: 15
  },
  {
    id: "credit-cards",
    category: "Debt",
    name: "Credit Cards",
    amount: 150,
    isFixed: false,
    description: "Minimum credit card payments",
    dueDate: 20
  },
  {
    id: "personal-loan",
    category: "Debt",
    name: "Personal Loan",
    amount: 200,
    isFixed: true,
    description: "Monthly personal loan payment",
    dueDate: 10
  },

  // Entertainment & Recreation
  {
    id: "streaming-services",
    category: "Entertainment",
    name: "Streaming Services",
    amount: 45,
    isFixed: true,
    description: "Netflix, Hulu, Disney+, etc.",
    dueDate: 1
  },
  {
    id: "gym-membership",
    category: "Entertainment",
    name: "Gym Membership",
    amount: 40,
    isFixed: true,
    description: "Monthly gym or fitness membership",
    dueDate: 1
  },
  {
    id: "hobbies",
    category: "Entertainment",
    name: "Hobbies & Recreation",
    amount: 100,
    isFixed: false,
    description: "Monthly hobby and recreation costs",
    dueDate: 30
  },

  // Personal Care
  {
    id: "haircuts",
    category: "Personal Care",
    name: "Haircuts & Grooming",
    amount: 60,
    isFixed: false,
    description: "Monthly personal grooming costs",
    dueDate: 30
  },
  {
    id: "personal-care-products",
    category: "Personal Care",
    name: "Personal Care Products",
    amount: 40,
    isFixed: false,
    description: "Toiletries and personal care items",
    dueDate: 30
  },

  // Clothing
  {
    id: "clothing",
    category: "Clothing",
    name: "Clothing & Accessories",
    amount: 100,
    isFixed: false,
    description: "Monthly clothing purchases",
    dueDate: 30
  },

  // Education
  {
    id: "tuition",
    category: "Education",
    name: "Tuition",
    amount: 500,
    isFixed: true,
    description: "Monthly tuition payment",
    dueDate: 1
  },
  {
    id: "books-supplies",
    category: "Education",
    name: "Books & Supplies",
    amount: 75,
    isFixed: false,
    description: "Monthly educational materials",
    dueDate: 30
  },

  // Savings & Investments
  {
    id: "emergency-fund",
    category: "Savings",
    name: "Emergency Fund",
    amount: 200,
    isFixed: true,
    description: "Monthly emergency fund contribution",
    dueDate: 1
  },
  {
    id: "retirement",
    category: "Savings",
    name: "Retirement Savings",
    amount: 300,
    isFixed: true,
    description: "Monthly retirement contribution",
    dueDate: 1
  },
  {
    id: "vacation-fund",
    category: "Savings",
    name: "Vacation Fund",
    amount: 150,
    isFixed: true,
    description: "Monthly vacation savings",
    dueDate: 1
  },

  // Miscellaneous
  {
    id: "pet-expenses",
    category: "Other",
    name: "Pet Expenses",
    amount: 80,
    isFixed: false,
    description: "Pet food, vet visits, grooming",
    dueDate: 30
  },
  {
    id: "gifts",
    category: "Other",
    name: "Gifts",
    amount: 100,
    isFixed: false,
    description: "Monthly gift budget",
    dueDate: 30
  },
  {
    id: "charitable-donations",
    category: "Other",
    name: "Charitable Donations",
    amount: 50,
    isFixed: true,
    description: "Monthly charitable giving",
    dueDate: 1
  },
  {
    id: "subscriptions",
    category: "Other",
    name: "Other Subscriptions",
    amount: 30,
    isFixed: true,
    description: "Magazines, software, etc.",
    dueDate: 1
  }
];

// Helper function to get expenses by category
export function getExpensesByCategory(category: string): MonthlyExpense[] {
  return monthlyExpenses.filter(expense => expense.category === category);
}

// Helper function to get fixed vs variable expenses
export function getFixedExpenses(): MonthlyExpense[] {
  return monthlyExpenses.filter(expense => expense.isFixed);
}

export function getVariableExpenses(): MonthlyExpense[] {
  return monthlyExpenses.filter(expense => !expense.isFixed);
}

// Helper function to calculate total monthly expenses
export function getTotalMonthlyExpenses(): number {
  return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
}

// Helper function to get expenses by due date
export function getExpensesByDueDate(dueDate: number): MonthlyExpense[] {
  return monthlyExpenses.filter(expense => expense.dueDate === dueDate);
}

// Helper function to get expenses due in the next 7 days
export function getExpensesDueSoon(daysAhead: number = 7): MonthlyExpense[] {
  const today = new Date();
  const currentDay = today.getDate();
  
  return monthlyExpenses.filter(expense => {
    if (!expense.dueDate) return false;
    
    // Calculate days until due
    let daysUntilDue = expense.dueDate - currentDay;
    if (daysUntilDue < 0) {
      // Due date has passed this month, calculate for next month
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      daysUntilDue += daysInMonth;
    }
    
    return daysUntilDue <= daysAhead;
  });
}

// Helper function to get expenses by amount range
export function getExpensesByAmountRange(minAmount: number, maxAmount: number): MonthlyExpense[] {
  return monthlyExpenses.filter(expense => 
    expense.amount >= minAmount && expense.amount <= maxAmount
  );
}
