"use strict";

import { activeEvent, eventModalVisible, setActiveEvent, clickedSpot, setClickedSpot } from "./state.js";
import { createWeekCal } from "./script.js";
import { currFullDate } from "./state.js";

export function openMakeEventModal(clickedSpot) {
	setClickedSpot(clickedSpot);
	setDate();
	setTime();
	if (!eventModalVisible) {
		const wasEmptySlot = clickedSpot.className === "cell";
		if (wasEmptySlot) {
			createNewEvent();
		} else if (!wasEmptySlot) {
			modifyEvent();
		}
	} else {
		if (activeEvent.isNew) {
			releaseSpace();
		}
		setActiveEvent(null);
		emptyTitleInput();
	}
}

function exitModal() {
	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		if (activeEvent.isNew) {
			releaseSpace();
		}
		emptyTitleInput();
		setActiveEvent(null);
	};
}

function saveEvent() {
	const saveBtn = document.querySelector(".save-event-btn");

	saveBtn.onclick = () => {
		setActiveEvent({ ...activeEvent, isNew: false });
		const inputedEventTitle = document.querySelector(".event-title");
		const title = inputedEventTitle.value ? inputedEventTitle.value : "(no title)";
		addTitleToCreatedEvent(activeEvent.id, title);

		setActiveEvent(null);
		emptyTitleInput();
	};
}

function createNewEvent() {
	hideDeleteBtn();
	const eventId = takeEmptySlot();
	updateEventDetailsOnChange();
	let title = document.querySelector(".event-title").value;
	if (title) {
		addTitleToCreatedEvent(eventId, title);
	} else {
		addTitleToCreatedEvent(eventId);
	}
	addButtonFunctionality();
	setActiveEvent({ id: eventId, isNew: true });
}

function addButtonFunctionality() {
	saveEvent();
	exitModal();
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function takeEmptySlot() {
	let [date, time] = clickedSpot.id.split(" ");
	if (clickedSpot.firstChild) {
		time = addThirtyMinutes(time);
	}
	const newEvent = document.createElement("div");
	newEvent.className = "created-event";
	newEvent.id = `${date} ${time} event`;
	clickedSpot.appendChild(newEvent);
	return newEvent.id;
}

function addTitleToCreatedEvent(eventId, title = "(no title)") {
	const currEvent = document.getElementById(eventId);
	const eventStartTime = document.querySelector(".event-start-time");
	const eventEndTime = document.querySelector(".event-end-time");
	if (eventEndTime.value !== addThirtyMinutes(eventStartTime.value)) {
		currEvent.innerText = `${title} |\n ${eventStartTime.value} - ${eventEndTime.value}`;
	} else {
		currEvent.innerText = `${title} | ${eventStartTime.value}`;
	}
}

function modifyEvent() {
	setActiveEvent({ id: clickedSpot.id, isNew: false });
	activateDeleteBtn();
	showSelectedEventNameInModal();
	addButtonFunctionality();
}

function activateDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "block";
	deleteBtn.onclick = () => {
		releaseSpace();
		setActiveEvent(null);
	};
}

function showSelectedEventNameInModal() {
	const onlyTitle = clickedSpot.innerText.split("|")[0];
	const title = onlyTitle.trim() === "(no title)" ? "" : onlyTitle;
	document.querySelector(".event-title").value = title;
}

function releaseSpace(noTitleEmptying) {
	document.getElementById(activeEvent.id).remove();
	if (!noTitleEmptying) emptyTitleInput();
}

function emptyTitleInput() {
	const inputedEventTitle = document.querySelector(".event-title");
	inputedEventTitle.value = "";
}

function setDate() {
	const eventDate = document.querySelector(".event-date");
	eventDate.value = clickedSpot.id.split(" ")[0];
}

function setTime() {
	const eventStartTime = document.querySelector(".event-start-time");
	const eventEndTime = document.querySelector(".event-end-time");
	if (clickedSpot.firstChild) {
		eventStartTime.value = addThirtyMinutes(getClickedSpotTime());
	} else {
		eventStartTime.value = getClickedSpotTime();
	}
	eventEndTime.value = addThirtyMinutes(eventStartTime.value);
}

function getClickedSpotTime() {
	return clickedSpot.id.split(" ")[1];
}

function updateEventDetailsOnChange() {
	const eventDate = document.querySelector(".event-date");
	const eventStartTime = document.querySelector(".event-start-time");
	const eventEndTime = document.querySelector(".event-end-time");
	let [date, time] = clickedSpot.id.split(" ");

	eventDate.onchange = () => {
		changeWeek(eventDate.value);
		date = eventDate.value;
		updateEventDetails(date, time);
		compareEndTime();
	};
	eventStartTime.onchange = () => {
		releaseSpace(true);
		time = eventStartTime.value;
		if (eventStartTime.value > eventEndTime.value) {
			eventEndTime.value = addThirtyMinutes(eventStartTime.value);
		}
		updateEventDetails(date, time);
		compareEndTime();
	};

	eventEndTime.onchange = () => {
		compareEndTime();
		addTitleToCreatedEvent(activeEvent.id);
	};
}

function updateEventDetails(date, time) {
	let newSpotId = `${date} ${time.split(":")[0]}:00`;
	setClickedSpot(document.getElementById(newSpotId));
	createNewEvent();
}

function changeWeek(selectedDate) {
	currFullDate.setTime(new Date(selectedDate));
	createWeekCal();
}

function compareEndTime() {
	const eventStartTime = document.querySelector(".event-start-time");
	const eventEndTime = document.querySelector(".event-end-time");

	changeEventHeight(calculateEventTimeInMin(eventStartTime.value, eventEndTime.value));

	checkEventTimeValidity(eventStartTime, eventEndTime);
}

function checkEventTimeValidity(eventStartTime, eventEndTime) {
	const nonValidTimeMsg = document.querySelector(".non-valid-time-msg");
	const saveBtn = document.querySelector(".save-event-btn");
	let nonValidEndTime = eventStartTime.value > eventEndTime.value;
	if (nonValidEndTime) {
		nonValidTimeMsg.style.display = "block";
		eventEndTime.classList.add("non-valid");
		saveBtn.classList.add("disabled");
		saveBtn.disabled = true;
	} else {
		nonValidTimeMsg.style.display = "none";
		eventEndTime.classList.remove("non-valid");
		saveBtn.classList.remove("disabled");
		saveBtn.disabled = false;
	}
}

function calculateEventTimeInMin(start, end) {
	const [startHour, startMin] = start.split(":");
	const [endHour, endMin] = end.split(":");
	const hourDif = +endHour - +startHour;
	const minDif = +endMin - +startMin;
	const eventTimeInMins = hourDif * 60 + minDif;
	return eventTimeInMins;
}

function changeEventHeight(eventTimeInMins) {
	const eventToChange = document.getElementById(activeEvent.id);
	const percentage = (100 * eventTimeInMins) / 60;

	eventToChange.style.height = `${percentage}%`;

	// eventToChange.style.height =
}

// function getEndTime(startTime) {
// 	const eventEndTime = document.querySelector(".event-end-time");
// 	let endTime;

// 	eventEndTime.onchange = () => {
// 		console.log(eventEndTime.value);
// 		let [startHour, startMin] = startTime.split(":");
// 		let [endHour, endMin] = eventEndTime.value.split(":");
// 		console.log(+endHour - +startHour);
// 		console.log(+endMin - +startMin);
// 	};
// }

function addThirtyMinutes(eventStart) {
	let [hour, min] = eventStart.split(":");
	const isLessThan60 = +min + 30 < 60;
	const addToMinutes = `${hour}:${+min + 30}`;
	let mins = +min - 30 === 0 ? "00" : +min - 30;
	const addToHoursAndMinutes = `${getFormatedHour(+hour + 1)}:${mins}`;
	return isLessThan60 ? addToMinutes : addToHoursAndMinutes;
}

function getFormatedHour(hour) {
	return hour < 10 ? `0${hour}:00` : `${hour}:00`;
}

// function getEventHeight() {}
