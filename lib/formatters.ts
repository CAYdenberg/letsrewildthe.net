import { datetime } from "ptera";
import { formatDate } from "ptera/format.ts";

export const classNames = (
  ...classNames: (string | null | false | undefined)[]
) => {
  return classNames.filter(Boolean).join(" ");
};

export const postDate = (date?: Date) => {
  if (!date) return null;
  return formatDate(datetime(date), "MMM dd, YYYY");
};
