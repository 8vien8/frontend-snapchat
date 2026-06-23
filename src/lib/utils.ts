import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isSameWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOnlineTime(date: Date | string): string {
  const now = Date.now();
  const timestamp = new Date(date).getTime();

  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);

  return `${diffInYears} year${diffInYears === 1 ? "" : "s"}`;
}

export function formatMessageTime(date: Date): string {
  const now = new Date();

  if (isToday(date)) {
    return format(date, "HH:mm");
  }

  if (isSameWeek(date, now, { weekStartsOn: 1 })) {
    return format(date, "EEE HH:mm");
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "MM/dd, HH:mm");
  }

  return format(date, "MM/dd/yyyy, HH:mm");
}
