"use strict";

import { activeEvent, eventModalVisible, setActiveEvent } from "./state.js";

export function openMakeEventModal(clickedEl) {
	if (!eventModalVisible) {
		const wasEmptySlot = clickedEl.className === "cell";
		if (wasEmptySlot) {
			setActiveEvent(createNewEvent(clickedEl));
		} else if (!wasEmptySlot) {
			setActiveEvent(modifyEvent(clickedEl));
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
	addTitleToCreatedEvent(eventId);
	saveEvent();
	exitModal();
	return { id: eventId, isNew: true };
}

function hideDeleteBtn() {
	const deleteBtn = document.querySelector(".delete-btn");
	deleteBtn.style.display = "none";
}

function takeEmptySlot(clickedSpot) {
	const newEvent = document.createElement("div");
	newEvent.className = "created-event";
	newEvent.id = clickedSpot.id + "-event";
	clickedSpot.appendChild(newEvent);
	return newEvent.id;
}

function addTitleToCreatedEvent(eventId, title = "(no title)") {
	const currEvent = document.getElementById(eventId);
	currEvent.innerText = `${title}`;
}

function modifyEvent(clickedEvent) {
	activateDeleteBtn(clickedEvent.id);
	showSelectedEventNameInModal(clickedEvent);
	saveEvent();
	exitModal();
	return { id: clickedEvent.id, isNew: false };
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
	const title = clickedEvent.innerText === "(no title)" ? "" : clickedEvent.innerText;
	document.querySelector(".event-title").value = title;
}

function releaseSpace(selectedEventId) {
	document.getElementById(selectedEventId).remove();
	emptyTitleInput();
}

function emptyTitleInput() {
	const inputedEventTitle = document.querySelector(".event-title");
	inputedEventTitle.value = "";
}
