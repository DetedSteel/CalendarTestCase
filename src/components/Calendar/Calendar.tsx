import { useEffect, useState, type FC } from "react";
import "./Calendar.css";
import axios from "axios";
import { reminders } from "../../mocks";
import {
  transformReminders,
  getEventsForDay,
  isCurrentDay,
  isCurrentMonth,
  formatDateKey,
  generateCalendarDays,
  groupDaysByWeeks,
} from "../../funcs/funcs";
import type { RemindersData, Reminder } from "../../funcs/types";

const monthNames: string[] = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const dayNames: string[] = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

const Calendar: FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [data, setData] = useState<RemindersData>();
  const [currentDayEvents, setCurrentDayEvents] = useState<Reminder[]>([]);

  const searchParams = new URLSearchParams(window.location.search);
  const t_user_id = searchParams.get("t_user_id");
  const token = searchParams.get("token");

  const prevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Переход к следующему месяцу
  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const nextWeek = (): void => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setCurrentDate(nextWeekDate);
  };

  const prevWeek = (): void => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setCurrentDate(prevWeekDate);
  };

  const remindersByDate = transformReminders(data);

  const calendarDays = generateCalendarDays(currentDate);
  const weeks = groupDaysByWeeks(calendarDays);
  const weeksToShow = isExpanded
    ? weeks
    : [weeks.find((week) => week.some((day) => isCurrentDay(day, currentDate))) || weeks[0]];

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(
          "https://bot-igor.ru/reminders",
          {
            t_user_id: Number(t_user_id),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
        setData(reminders);
      }
    })();
  }, [t_user_id, token]);

  useEffect(() => {
    setCurrentDayEvents(getEventsForDay(currentDate, remindersByDate));
  }, [currentDate]);

  return (
    <>
      <div className="calendar">
        <div className="calendar-header">
          <p>
            <span className="bold">{monthNames[currentDate.getMonth()]}</span>{" "}
            {currentDate.getFullYear()}
          </p>
          <div className="header-right-block">
            <img
              className="avatar"
              src="https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_675ad0d5d1490b7feb9ebd49_675ad3020280672b476d4ecf/scale_1200"
              alt=""
            />

            <div className="header-btns-container">
              <button
                className="header-btn"
                onClick={() => {
                  if (isExpanded) {
                    prevMonth();
                  } else {
                    prevWeek();
                  }
                }}
              >
                <img src="/images/arrow-left.svg" alt="" />
              </button>
              <button
                className="header-btn"
                onClick={() => {
                  if (isExpanded) {
                    nextMonth();
                  } else {
                    nextWeek();
                  }
                }}
              >
                <img src="/images/arrow-right.svg" alt="" />
              </button>
              <button
                className="header-btn"
                onClick={() => {
                  setCurrentDate(new Date());
                }}
              >
                Сегодня
              </button>
            </div>
          </div>
        </div>
        <table className="calendar-table">
          <thead>
            <tr>
              {dayNames.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeksToShow?.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day) => {
                  const dayEvents = getEventsForDay(day, remindersByDate);
                  const isToday = isCurrentDay(day, currentDate);
                  const isMonth = isCurrentMonth(day, currentDate);

                  return (
                    <td
                      key={formatDateKey(day)}
                      className={`day-cell 
                      ${isMonth ? "" : "other-month"} 
                      ${isToday ? "current-day" : ""}`}
                    >
                      <div
                        onClick={() => {
                          if (isMonth) {
                            setCurrentDate(
                              new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                day.getDate()
                              )
                            );
                          } else {
                            setCurrentDate(
                              new Date(currentDate.getFullYear(), day.getMonth(), day.getDate())
                            );
                          }
                        }}
                        className="day-number"
                      >
                        {day.getDate()}
                        <div
                          className="events"
                          style={{
                            width: `${dayEvents.length > 0 ? 8 + (dayEvents.length - 1) * 4 : 0}px`,
                          }}
                        ></div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${isExpanded ? "revert" : ""} expand-btn`}
        >
          <img src="/images/arrow-down.svg" alt="" />
        </button>
      </div>
      <p className="bold events-for-day-title">
        {currentDate.toLocaleDateString("ru", { month: "long", day: "numeric" })}
      </p>
      {currentDayEvents.length === 0 && <p className="no-events">Сегодня событий нет</p>}
      <div className="events-for-day">
        <div className="events-list">
          {currentDayEvents?.map((ev, ix) => (
            <div className="event-item" key={ix}>
              <div className="event-text">
                <span>{ev.reminder_text}</span>
                <p>
                  {new Date(ev.reminder_on_datetime).toLocaleTimeString("ru", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calendar;
