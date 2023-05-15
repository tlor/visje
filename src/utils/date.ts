const today = new Date();
const todaysWeek = getWeekNumber(today);
const oneDay = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;

export function getLocalISOString(date) {
  const offset = date.getTimezoneOffset();
  const offsetAbs = Math.abs(offset);
  const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString();
  return isoString;
}

export function isThisWeek(from, to = null) {
  if (!to) return getWeekNumber(today) === getWeekNumber(from);
  return todaysWeek === (getWeekNumber(from) || getWeekNumber(to));
}

export function getWeekNumber(d) {
  d = new Date(d);
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function displayDay(dateParam: string | Date) {
  if (typeof dateParam === `string`) dateParam = new Date(dateParam);
  return dateParam.toLocaleDateString("nl", { weekday: "long" });
}

export function displayTime(dateParam: string | Date) {
  if (typeof dateParam === `string`) dateParam = new Date(dateParam);
  const minutes = new Date(dateParam).getMinutes();
  return `${new Date(dateParam).getHours()}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
}

export function displayDate(dateParam: string | Date) {
  if (!dateParam) {
    return null;
  }

  const date: any =
    typeof dateParam === "object" ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today: any = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();

  if (seconds < 5) {
    return "nu net";
  } else if (seconds < 60) {
    return `${seconds} seconden geleden`;
  } else if (seconds < 90) {
    return "een minuut geleden";
  } else if (minutes < 60) {
    return `${minutes} minuten geleden`;
  } else if (isToday) {
    return getFormattedDate(date, "Vandaag"); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, "Gisteren"); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}

export function getFormattedDate(
  date,
  prefomattedDate = null,
  hideYear = false
) {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${minutes}`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${prefomattedDate} om ${hours}:${minutes}`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${day} ${month} om ${hours}:${minutes}`;
  }

  // 10. January 2017. at 10:20
  return `${day} ${month} ${year} om ${hours}:${minutes}`;
}

export function displayReadableDate(date: Date): string {
  return `${date.toLocaleDateString("nl", {
    weekday: "long",
  })} ${date.getDate()}-${date.getMonth() + 1}`;
}

export function getFormattedEventDate(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (sameDay(fromDate, toDate)) {
    if (
      sameDay(fromDate, new Date()) &&
      fromDate.getHours() === 0 &&
      toDate.getHours() === 23
    ) {
      return "Vandaag!";
    } else if (sameDay(fromDate, new Date())) {
      const mins = ("0" + fromDate.getMinutes()).slice(-2);
      return `Vandaag om ${fromDate.getHours()}:${mins}`;
    } else if (fromDate.getHours() === 0 && toDate.getHours() === 23) {
      return displayReadableDate(fromDate);
    }

    return displayReadableDate(fromDate);
  }

  if (sameDay(fromDate, new Date())) {
    if (to == null) return "Vandaag!";

    const formattedTo = displayReadableDate(toDate);

    return `Vandaag om ${fromDate.getHours()}:${fromDate.getMinutes()} tot ${formattedTo}`;
  }

  const formattedFrom = displayReadableDate(fromDate);

  if (to == null) return formattedFrom;

  const formattedTo = displayReadableDate(toDate);

  return `${formattedFrom} tot ${formattedTo}`;
}

export function allDay(d1, d2) {
  //                               convert ms to hours               min  sec   ms
  const hoursBetweenDates =
    Math.abs(d1.getTime() - d2.getTime()) / (60 * 60 * 1000);
  return hoursBetweenDates === 24;
}

export function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
