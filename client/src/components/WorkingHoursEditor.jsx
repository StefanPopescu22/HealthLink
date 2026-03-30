import { FaPlus, FaTrash } from "react-icons/fa6";
import "../styles/WorkingHoursEditor.css";

const weekdayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function WorkingHoursEditor({ workingHours, setWorkingHours }) {
  const addInterval = () => {
    setWorkingHours((prev) => [
      ...prev,
      {
        weekday: 1,
        startTime: "09:00",
        endTime: "15:00",
      },
    ]);
  };

  const updateInterval = (index, field, value) => {
    setWorkingHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeInterval = (index) => {
    setWorkingHours((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="working-hours-editor soft-card">
      <div className="working-hours-header">
        <div>
          <h2>Doctor Working Hours</h2>
          <p>Set one or more weekly working intervals.</p>
        </div>

        <button type="button" className="secondary-btn" onClick={addInterval}>
          <FaPlus />
          Add Interval
        </button>
      </div>

      <div className="working-hours-list">
        {workingHours.map((item, index) => (
          <div className="working-hours-row" key={index}>
            <select
              value={item.weekday}
              onChange={(e) => updateInterval(index, "weekday", Number(e.target.value))}
            >
              {weekdayOptions.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={item.startTime}
              onChange={(e) => updateInterval(index, "startTime", e.target.value)}
            />

            <input
              type="time"
              value={item.endTime}
              onChange={(e) => updateInterval(index, "endTime", e.target.value)}
            />

            <button
              type="button"
              className="secondary-btn danger-outline-btn"
              onClick={() => removeInterval(index)}
              disabled={workingHours.length === 1}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkingHoursEditor;