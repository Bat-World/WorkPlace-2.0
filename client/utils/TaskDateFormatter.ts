/**
 * Robust date formatter function for task-related dates
 * Handles various date formats and provides user-friendly relative dates
 */

export const formatTaskDate = (
  dateString: string | number | null | undefined
): string => {
  if (!dateString) return "Огноо байхгүй";

  try {
    // Handle different date formats
    let date: Date;

    // If it's a number (Unix timestamp), convert it
    if (typeof dateString === "number") {
      // Check if it's in seconds or milliseconds
      if (dateString < 10000000000) {
        // It's in seconds, convert to milliseconds
        date = new Date(dateString * 1000);
      } else {
        // It's already in milliseconds
        date = new Date(dateString);
      }
    } else if (typeof dateString === "string") {
      // If it's a string, try to parse it
      const parsed = parseInt(dateString);
      if (!isNaN(parsed)) {
        // It's a numeric string (timestamp)
        if (parsed < 10000000000) {
          date = new Date(parsed * 1000);
        } else {
          date = new Date(parsed);
        }
      } else {
        // It's a regular date string
        date = new Date(dateString);
      }
    } else {
      date = new Date(dateString);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date after parsing:", dateString);
      return "Буруу огноо";
    }

    // Format the date
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If it's today
    if (diffInDays === 0) {
      return `Өнөөдөр ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If it's yesterday
    if (diffInDays === 1) {
      return `Өчигдөр ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If it's within the last 7 days
    if (diffInDays < 7) {
      const weekdays = {
        0: "Ням",
        1: "Даваа",
        2: "Мягмар",
        3: "Лхагва",
        4: "Пүрэв",
        5: "Баасан",
        6: "Бямба",
      };
      const weekday = weekdays[date.getDay() as keyof typeof weekdays];
      return `${weekday} ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If it's within the last year
    if (diffInDays < 365) {
      const months = {
        0: "1-p сарын",
        1: "2-p сарын",
        2: "3-p сарын",
        3: "4-p сарын",
        4: "5-p сарын",
        5: "6-p сарын",
        6: "7-p сарын",
        7: "8-p сарын",
        8: "9-p сарын",
        9: "10-p сарын",
        10: "11-р сарын",
        11: "12-р сарын",
      };
      const month = months[date.getMonth() as keyof typeof months];
      return `${month} ${date.getDate()} ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If it's older than a year
    const months = {
      0: "Нэгдүгээр сар",
      1: "Хоёрдугаар сар",
      2: "Гуравдугаар сар",
      3: "Дөрөвдүгээр сар",
      4: "Тавдугаар сар",
      5: "Зургадугаар сар",
      6: "Долдугаар сар",
      7: "Наймдугаар сар",
      8: "Есдүгээр сар",
      9: "Аравдугаар сар",
      10: "Арван нэгдүгээр сар",
      11: "Арван хоёрдугаар сар",
    };
    const month = months[date.getMonth() as keyof typeof months];
    return `${month} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleTimeString(
      "mn-MN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      }
    )}`;
  } catch (error) {
    console.error(
      "Error formatting task date:",
      error,
      "Date string:",
      dateString
    );
    return "Огноо байхгүй";
  }
};

/**
 * Format due date for tasks with special handling for overdue dates
 */
export const formatTaskDueDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "Дуусах хугацаа байхгүй";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Буруу дуусах хугацаа";
    }

    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If overdue
    if (diffInDays < 0) {
      const overdueDays = Math.abs(diffInDays);
      if (overdueDays === 1) {
        return `1 өдөр хэтэрсэн`;
      }
      return `${overdueDays} өдөр хэтэрсэн`;
    }

    // If due today
    if (diffInDays === 0) {
      return `Өнөөдөр ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If due tomorrow
    if (diffInDays === 1) {
      return `Маргааш ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If due within a week
    if (diffInDays < 7) {
      const weekdays = {
        0: "Ням",
        1: "Даваа",
        2: "Мягмар",
        3: "Лхагва",
        4: "Пүрэв",
        5: "Баасан",
        6: "Бямба",
      };
      const weekday = weekdays[date.getDay() as keyof typeof weekdays];
      return `${weekday} ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If due within a month
    if (diffInDays < 30) {
      const months = {
        0: "Нэгдүгээр сар",
        1: "Хоёрдугаар сар",
        2: "Гуравдугаар сар",
        3: "Дөрөвдүгээр сар",
        4: "Тавдугаар сар",
        5: "Зургадугаар сар",
        6: "Долдугаар сар",
        7: "Наймдугаар сар",
        8: "Есдүгээр сар",
        9: "Аравдугаар сар",
        10: "Арван нэгдүгээр сар",
        11: "Арван хоёрдугаар сар",
      };
      const month = months[date.getMonth() as keyof typeof months];
      return `${month} ${date.getDate()} ${date.toLocaleTimeString("mn-MN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    // If due later
    const months = {
      0: "Нэгдүгээр сар",
      1: "Хоёрдугаар сар",
      2: "Гуравдугаар сар",
      3: "Дөрөвдүгээр сар",
      4: "Тавдугаар сар",
      5: "Зургадугаар сар",
      6: "Долдугаар сар",
      7: "Наймдугаар сар",
      8: "Есдүгээр сар",
      9: "Аравдугаар сар",
      10: "Арван нэгдүгээр сар",
      11: "Арван хоёрдугаар сар",
    };
    const month = months[date.getMonth() as keyof typeof months];
    return `${month} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleTimeString(
      "mn-MN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      }
    )}`;
  } catch (error) {
    console.error(
      "Error formatting due date:",
      error,
      "Date string:",
      dateString
    );
    return "Буруу дуусах хугацаа";
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "Алдаатай цаг";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Алдаатай цаг";
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    // Less than 1 minute
    if (diffInSeconds < 60) {
      return "саяхан";
    }

    // Less than 1 hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} минутын өмнө`;
    }

    // Less than 24 hours
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} цагийн өмнө`;
    }

    // Less than 7 days
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} өдрийн өмнө`;
    }

    // Less than 30 days
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} долоо хоногийн өмнө`;
    }

    // Less than 365 days
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} сарын өмнө`;
    }

    // More than 1 year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} жилийн өмнө`;
  } catch (error) {
    console.error(
      "Error getting relative time:",
      error,
      "Date string:",
      dateString
    );
    return "Алдаатай цаг";
  }
};
