export function formatDateToMMDDYYYY(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}
