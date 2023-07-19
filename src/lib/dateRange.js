export default function getAllDatesInRangeToToday(startDate) {
  const todayDate = new Date();
  const dateArray = [];
  while (startDate <= todayDate) {
    dateArray.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dateArray;
}
