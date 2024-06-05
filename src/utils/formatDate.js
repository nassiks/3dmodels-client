import { format } from "date-fns";

export const formatDate = (dateString) => {
  return format(new Date(dateString), "dd-MM-yyyy HH:mm");
};
