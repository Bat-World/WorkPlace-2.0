/**
 * Robust date formatter function for task-related dates
 * Handles various date formats and provides user-friendly relative dates
 */

export const formatTaskDate = (dateString: string | number | null | undefined): string => {
  if (!dateString) return "Date not available";

  try {
    // Handle different date formats
    let date: Date;
    
    // If it's a number (Unix timestamp), convert it
    if (typeof dateString === 'number') {
      // Check if it's in seconds or milliseconds
      if (dateString < 10000000000) {
        // It's in seconds, convert to milliseconds
        date = new Date(dateString * 1000);
      } else {
        // It's already in milliseconds
        date = new Date(dateString);
      }
    } else if (typeof dateString === 'string') {
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
      console.error('Invalid date after parsing:', dateString);
      return "Invalid date";
    }

    // Format the date
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If it's today
    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If it's yesterday
    if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If it's within the last 7 days
    if (diffInDays < 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If it's within the last year
    if (diffInDays < 365) {
      return `${date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      })} at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If it's older than a year
    return `${date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    })} at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;

  } catch (error) {
    console.error('Error formatting task date:', error, 'Date string:', dateString);
    return "Date not available";
  }
};

/**
 * Format due date for tasks with special handling for overdue dates
 */
export const formatTaskDueDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "No due date";

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Invalid due date";
    }

    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // If overdue
    if (diffInDays < 0) {
      const overdueDays = Math.abs(diffInDays);
      if (overdueDays === 1) {
        return `Overdue by 1 day`;
      }
      return `Overdue by ${overdueDays} days`;
    }

    // If due today
    if (diffInDays === 0) {
      return `Due today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If due tomorrow
    if (diffInDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If due within a week
    if (diffInDays < 7) {
      return `Due ${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If due within a month
    if (diffInDays < 30) {
      return `Due ${date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      })} at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`;
    }

    // If due later
    return `Due ${date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    })} at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;

  } catch (error) {
    console.error('Error formatting due date:', error, 'Date string:', dateString);
    return "Invalid due date";
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "Unknown time";

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Invalid time";
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    // Less than 1 minute
    if (diffInSeconds < 60) {
      return "just now";
    }

    // Less than 1 hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }

    // Less than 24 hours
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    // Less than 7 days
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    // Less than 30 days
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }

    // Less than 365 days
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }

    // More than 1 year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years !== 1 ? 's' : ''} ago`;

  } catch (error) {
    console.error('Error getting relative time:', error, 'Date string:', dateString);
    return "Unknown time";
  }
}; 