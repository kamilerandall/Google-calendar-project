"use strict";

import { currFullDate } from "./state.js";

const mainPart = document.querySelector(".main-part");
const weekViewContainer = document.querySelector(".week-view");
const weekViewHeader = document.querySelector(".week-view-header");
const eventModal = document.querySelector(".event-creation");
eventModal.style.display = "none";

export function createHours() {
	const calHours = document.createElement("ul");
	calHours.className = "cal-hours";
	mainPart.prepend(calHours);
	for (let i = 1; i <= 12; i++) {
		const hour = document.createElement("li");
		hour.className = "hour";
		i < 12 ? (hour.innerText = i + "AM") : (hour.innerText = i + "PM");
		calHours.appendChild(hour);
	}
	for (let i = 1; i < 12; i++) {
		const hour = document.createElement("li");
		hour.className = "hour";
		hour.innerText = i + "PM";
		calHours.appendChild(hour);
	}
}

const weekDayRow = document.createElement("ul");
weekDayRow.className = "weekday";
weekViewHeader.appendChild(weekDayRow);
export function createWeekdays() {
	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	for (let day of daysOfWeek) {
		let weekDayName = document.createElement("li");
		if (daysOfWeek.indexOf(day) === new Date().getDay()) {
			weekDayName.className = "active";
		}
		weekDayName.innerHTML = day;
		weekDayRow.appendChild(weekDayName);
	}
}

const dayOfMonthRow = document.createElement("ul");
dayOfMonthRow.className = "day-of-the-month";
weekViewHeader.appendChild(dayOfMonthRow);

export function createNumWeekdays(currWeek) {
	dayOfMonthRow.innerHTML = "";
	for (let day of currWeek) {
		let dayNum = document.createElement("li");
		if (
			day === new Date().getDate() &&
			currFullDate.getMonth() === new Date().getMonth() &&
			currFullDate.getFullYear() === new Date().getFullYear()
		) {
			dayNum.className = "active";
		}
		dayNum.innerHTML = day;
		dayOfMonthRow.appendChild(dayNum);
	}
}

export function createGrid(currWeekInfo, rowCount) {
	const grid = document.querySelector(".by-the-hour");
	if (grid) {
		grid.remove();
	}
	let row = document.createElement("div");
	row.className = "by-the-hour";
	for (let hour = 0; hour < rowCount; hour++) {
		currWeekInfo.currWeek.forEach((day) => {
			let col = document.createElement("div");
			col.id = getFormatedDateForId(currWeekInfo, day, hour);
			col.className = "cell";
			row.appendChild(col);
		});
		weekViewContainer.appendChild(row);
	}
}

function getFormatedDateForId(currWeekInfo, day, hour) {
	const { firstMonthsYear, firstMonth, lastMonthsYear, lastMonth } = currWeekInfo;
	return firstMonth === lastMonth
		? `${firstMonthsYear}-${getFormatedMonth(firstMonth)}-${getFormatedDay(day)} ${getFormatedHour(hour)}`
		: day < 10
		? `${lastMonthsYear}-${getFormatedMonth(lastMonth)}-${getFormatedDay(day)} ${getFormatedHour(hour)}`
		: `${firstMonthsYear}-${getFormatedMonth(firstMonth)}-${getFormatedDay(day)} ${getFormatedHour(hour)}`;
}

function getFormatedMonth(month) {
	return month < 9 ? `0${month + 1}` : `${month + 1}`;
}

function getFormatedDay(day) {
	return day < 10 ? `0${day}` : `${day}`;
}

function getFormatedHour(hour) {
	return hour < 10 ? `0${hour}:00` : `${hour}:00`;
}

export function createStaticWeekCalPart() {
	createHours();
	createWeekdays();
}

export function createDynamicWeekCalPart(currWeekInfo) {
	createNumWeekdays(currWeekInfo.currWeek);
	createGrid(currWeekInfo, 24);
}
