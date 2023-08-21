import { currFullDate } from "./state.js";

const startDate = currFullDate;
let currYear = startDate.getFullYear();
let currMonth = startDate.getMonth();
const currDateOfMonth = startDate.getDate();

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function renderSmallCalendar() {
	const sideSelectedYear = document.querySelector(".year-side");
	const sideSelectedMonth = document.querySelector(".month-side");
	sideSelectedMonth.innerText = months[currMonth];
	sideSelectedYear.innerText = currYear;

	const lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();
	const lastDayOfPrevMonth = new Date(currYear, currMonth - 1, lastDateOfPrevMonth).getDay();

	const lastDateOfTheMonth = new Date(currYear, currMonth + 1, 0).getDate();
	const lastDayOfTheMonth = new Date(currYear, currMonth, lastDateOfTheMonth).getDay();
	const smallCal = document.querySelector(".side-bar-calendar");
	smallCal.innerHTML = "";
	const weekDayRow = document.createElement("ul");
	weekDayRow.className = "month-cal-weeks";
	smallCal.appendChild(weekDayRow);
	const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
	for (let day of daysOfWeek) {
		let weekDayName = document.createElement("li");
		weekDayName.innerHTML = day;
		weekDayRow.appendChild(weekDayName);
	}

	const daysWrapper = document.createElement("ul");
	daysWrapper.className = "month-cal-days";
	smallCal.appendChild(daysWrapper);

	function createDay(dayNum, dayClass) {
		const dayInSmallCal = document.createElement("li");
		if (dayClass) dayInSmallCal.className = dayClass;
		dayInSmallCal.innerText = dayNum;
		daysWrapper.appendChild(dayInSmallCal);
	}

	// visible inactive days of last month
	for (let i = lastDateOfPrevMonth - lastDayOfPrevMonth; i <= lastDateOfPrevMonth; i++) {
		createDay(i, "inactive");
	}
	// days of this month
	for (let i = 1; i <= lastDateOfTheMonth; i++) {
		if (i === currDateOfMonth && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()) {
			createDay(i, "active");
		} else {
			createDay(i);
		}
	}
	// visible inactive days of next month
	for (let i = 1; i < 7 - lastDayOfTheMonth; i++) {
		createDay(i, "inactive");
	}
}

const smallCalIcons = document.querySelector(".small-cal-icons");
smallCalIcons.addEventListener("click", (e) => {
	if (e.target.className.includes("prev")) {
		startDate.setMonth(currMonth - 1);
		currMonth = startDate.getMonth();
		currYear = startDate.getFullYear();
	} else if (e.target.className.includes("next")) {
		startDate.setMonth(currMonth + 1);
		currMonth = startDate.getMonth();
		currYear = startDate.getFullYear();
	}
	renderSmallCalendar(currYear, currMonth);
});
