import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (timestamp) => {
  const now = dayjs();
  const date = dayjs(timestamp);

  if (now.diff(date, "minute") < 1) return "now";
  if (now.diff(date, "minute") < 60) return `${now.diff(date, "minute")}m`;
  if (now.diff(date, "hour") < 24) return `${now.diff(date, "hour")}h`;
  if (now.diff(date, "day") === 1) return "Yesterday";
  if (now.diff(date, "day") < 7) return `${now.diff(date, "day")}d`;
  if (now.diff(date, "week") < 5) return `${now.diff(date, "week")}w`;
  if (now.diff(date, "month") < 12) return `${now.diff(date, "month")}mo`;

  return `${now.diff(date, "year")}y`;
};
