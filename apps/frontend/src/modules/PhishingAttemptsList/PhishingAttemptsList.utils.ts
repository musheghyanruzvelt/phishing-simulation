export const formatDate = (dateString?: Date) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};
