"use strict";

import { activeEvent, eventModalVisible, setActiveEvent } from "./state.js";
import { createWeekCal } from "./script.js";
import { currFullDate } from "./state.js";

export function openMakeEventModal(clickedEl) {
	setDate(clickedEl);
	setTime(clickedEl);
	if (!eventModalVisible) {
		const wasEmptySlot = clickedEl.className === "cell";
		if (wasEmptySlot) {
			createNewEvent(clickedEl);
		} else if (!wasEmptySlot) {
			modifyEvent(clickedEl);
		}
	} else {
		if (activeEvent.isNew) {
			releaseSpace(activeEvent.id);
		}
		setActiveEvent(null);
		emptyTitleInput();
	}
}

function exitModal() {
	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		if (activeEvent.isNew) {
			releaseSpace(activeEvent.id);
		}
		emptyTitleInput();
		setActiveEvent(null);
	};
}

function saveEvent() {
	const saveBtn = document.querySelector(".save-event-btn");
	saveBtn.onclick = () => {
		//activeEvent.isNew = false;

		setActiveEvent({ ...activeEvent, isNew: false });
		const inputedEventTitle = document.querySelector(".event-title");
		const title = inputedEventTitle.value ? inputedEventTitle.value : "(no title)";
		addTitleToCreatedEvent(activeEvent.id, title);

		setActiveEvent(null);
		emptyTitleInput();
	};
}

function createNewEvent(clickedSpot) {
	hideDeleteBtn();
	const eventId = takeEmptySlot(clickedSpot);
	// changeDate(clickedSpot);
	// changeStartTime(clickedSpot);
	changeEventPlace(clickedSpot);
	let title = document.querySelector(".event-title").value;
	if (title) {
		addTitleToCreatedEvent(eventId, title);
	} else {
		addTitleToCreatedEvent(eventId);
	}

	saveEvent(clickedSpot);
	exitModal();
	setActiveEvent({ id: eventId, isNew: true });
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function takeEmptySlot(clickedSpot) {
	let [date, time] = clickedSpot.id.split(" ");
	if (clickedSpot.firstChild) {
		time = getThirtyMinMore(time);
	}
	const newEvent = document.createElement("div");
	newEvent.className = "created-event";
	newEvent.id = `${date} ${time} event`;
	clickedSpot.appendChild(newEvent);
	return newEvent.id;
}

function addTitleToCreatedEvent(eventId, title = "(no title)") {
	const currEvent = document.getElementById(eventId);
	currEvent.innerText = `${title} | ${getClickedSpotTime(eventId)}`;
}

function modifyEvent(clickedEvent) {
	activateDeleteBtn(clickedEvent.id);
	showSelectedEventNameInModal(clickedEvent);
	saveEvent(clickedEvent);
	exitModal();
	setActiveEvent({ id: clickedEvent.id, isNew: false });
}

function activateDeleteBtn(selectedEventId) {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "block";
	deleteBtn.onclick = () => {
		releaseSpace(selectedEventId);
		setActiveEvent(null);
	};
}

function showSelectedEventNameInModal(clickedEvent) {
	const onlyTitle = clickedEvent.innerText.split("|")[0];
	const title = onlyTitle.trim() === "(no title)" ? "" : onlyTitle;
	document.querySelector(".event-title").value = title;
}

function releaseSpace(selectedEventId, noTitleEmptying) {
	document.getElementById(selectedEventId).remove();
	if (!noTitleEmptying) emptyTitleInput();
}

function emptyTitleInput() {
	const inputedEventTitle = document.querySelector(".event-title");
	inputedEventTitle.value = "";
}

function setDate(clickedSpot) {
	const eventDate = document.querySelector(".event-date");
	eventDate.value = clickedSpot.id.split(" ")[0];
}

function setTime(clickedSpot) {
	const eventStartTime = document.querySelector(".event-start-time");
	const eventEndTime = document.querySelector(".event-end-time");
	eventStartTime.value = getClickedSpotTime(clickedSpot.id);
	eventEndTime.value = getThirtyMinMore(eventStartTime.value);
}

function getClickedSpotTime(id) {
	return id.split(" ")[1];
}

// function changeDate(clickedSpot) {
// 	const eventDate = document.querySelector(".event-date");
// 	let time = clickedSpot.id.split(" ")[1];
// 	eventDate.onchange = () => {
// 		const idOfEventToRemove = `${clickedSpot.id} event`;
// 		releaseSpace(idOfEventToRemove, true);
// 		changeWeek(eventDate.value);
// 		let newSpotId = `${eventDate.value} ${time}`;
// 		createNewEvent(document.getElementById(newSpotId));
// 	};
// }

// function changeStartTime(clickedSpot) {
// 	const eventStartTime = document.querySelector(".event-start-time");
// 	let date = clickedSpot.id.split(" ")[0];
// 	eventStartTime.onchange = () => {
// 		const idOfEventToRemove = `${clickedSpot.id} event`;
// 		releaseSpace(idOfEventToRemove, true);
// 		let newSpotId = `${date} ${eventStartTime.value}`;
// 		createNewEvent(document.getElementById(newSpotId));
// 	};
// }

function changeEventPlace(clickedSpot) {
	const eventDate = document.querySelector(".event-date");
	const eventStartTime = document.querySelector(".event-start-time");
	let [date, time] = clickedSpot.id.split(" ");
	const idOfEventToRemove = `${clickedSpot.id} event`;
	eventDate.onchange = () => {
		releaseSpace(idOfEventToRemove, true);
		changeWeek(eventDate.value);
		let newSpotId = `${eventDate.value} ${time}`;
		createNewEvent(document.getElementById(newSpotId));
	};
	eventStartTime.onchange = () => {
		releaseSpace(idOfEventToRemove, true);
		let newSpotId = `${date} ${eventStartTime.value}`;
		createNewEvent(document.getElementById(newSpotId));
	};
}

function changeWeek(selectedDate) {
	currFullDate.setTime(new Date(selectedDate));
	createWeekCal();
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

function getThirtyMinMore(eventStart) {
	let [hour, min] = eventStart.split(":");
	const isLessThan60 = +min + 30 < 60;
	const addToMinutes = `${hour}:${+min + 30}`;
	const addToHoursAndMinutes = `${getFormatedHour(+hour + 1)}:${+min - 30}`;
	return isLessThan60 ? addToMinutes : addToHoursAndMinutes;
}

function getFormatedHour(hour) {
	return hour < 10 ? `0${hour}:00` : `${hour}:00`;
}

function getEventHeight() {}
