import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Format: "April 2 4:30PM"
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${day} ${time}`;
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }

  // Less than 24 hours
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }

  // Less than 7 days
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }

  // Less than 30 days
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}w ago`;
  }

  // Less than 365 days
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}mo ago`;
  }

  // More than 1 year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years}y ago`;
}

export function formatInvitationDate(createdAt: any): string {
  try {
    let dateValue = createdAt;
    
    if (typeof dateValue === 'string') {
      try {
        dateValue = JSON.parse(dateValue);
      } catch {
        dateValue = dateValue;
      }
    }
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    return formatDate(date.toISOString());
  } catch (error) {
    return "Invalid date";
  }
}
