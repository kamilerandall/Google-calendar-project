import {
	createHours,
	createWeekdays,
	createNumWeekdays,
	createGrid,
} from "./constructors.js";

const mainSelectedYear = document.querySelector(".year-main");
const mainSelectedMonth = document.querySelector(".month-main");

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

const today = new Date();
let currYear = today.getFullYear();
let currMonth = today.getMonth();
const currDayOfMonth = today.getDate();
const currDayOfWeek = today.getDay();

mainSelectedMonth.innerText = months[currMonth];
mainSelectedYear.innerText = currYear;

function getCurrWeek() {
	let currWeek = [];
	const firstDayOfThisWeek = currDayOfMonth - currDayOfWeek;
	const lastDayOfThisWeek = firstDayOfThisWeek + 6;
	for (let i = firstDayOfThisWeek; i <= lastDayOfThisWeek; i++) {
		currWeek.push(i);
	}
	return currWeek;
}

function renderSmallCalendar(currYear, currMonth) {
	const sideSelectedYear = document.querySelector(".year-side");
	const sideSelectedMonth = document.querySelector(".month-side");
	sideSelectedMonth.innerText = months[currMonth];
	sideSelectedYear.innerText = currYear;

	const lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate();
	const lastDayOfPrevMonth = new Date(
		currYear,
		currMonth - 1,
		lastDateOfPrevMonth
	).getDay();

	const lastDateOfTheMonth = new Date(currYear, currMonth + 1, 0).getDate();
	const lastDayOfTheMonth = new Date(
		currYear,
		currMonth,
		lastDateOfTheMonth
	).getDay();
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
	for (
		let i = lastDateOfPrevMonth - lastDayOfPrevMonth;
		i <= lastDateOfPrevMonth;
		i++
	) {
		createDay(i, "inactive");
	}
	// days of this month
	for (let i = 1; i <= lastDateOfTheMonth; i++) {
		if (
			i === currDayOfMonth //&&
			// currMonth === new Date.getMonth() &&
			// currYear === new Date.getFullYear()
		) {
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

renderSmallCalendar(currYear, currMonth);
createHours();
createWeekdays();
createNumWeekdays(getCurrWeek());
createGrid(7, 27);

const smallCalIcons = document.querySelector(".small-cal-icons");
smallCalIcons.addEventListener("click", (e) => {
	if (e.target.className.includes("prev")) {
		today.setMonth(currMonth - 1);
		currMonth = today.getMonth();
		currYear = today.getFullYear();
	} else if (e.target.className.includes("next")) {
		today.setMonth(currMonth + 1);
		currMonth = today.getMonth();
		currYear = today.getFullYear();
	}
	renderSmallCalendar(currYear, currMonth);
});
