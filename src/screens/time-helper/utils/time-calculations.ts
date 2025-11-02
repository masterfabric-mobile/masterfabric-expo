// Time Calculation Utility Functions

/**
 * Get days in month (handles leap years)
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Generate calendar grid with previous/next month days
 * Includes trailing days from previous month and leading days from next month
 */
export const generateCalendarGrid = (
  selectedYear: number,
  selectedMonth: number
): { day: number; isCurrentMonth: boolean }[][] => {
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const weeks: { day: number; isCurrentMonth: boolean }[][] = [];
  
  // Get previous month's last days
  const previousMonthDays = getDaysInMonth(
    selectedMonth === 0 ? selectedYear - 1 : selectedYear,
    selectedMonth === 0 ? 11 : selectedMonth - 1
  );
  
  // Start with previous month's trailing days
  let currentWeek: { day: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    currentWeek.push({ 
      day: previousMonthDays - i, 
      isCurrentMonth: false 
    });
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push({ day, isCurrentMonth: true });
    
    // When week is complete (7 days), start new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Fill remaining week with next month's days
  let nextMonthDay = 1;
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({ day: nextMonthDay, isCurrentMonth: false });
    nextMonthDay++;
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
};