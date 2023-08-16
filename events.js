"use strict";

let clicked = false;
let lastMadeEventId;

export function showCreateEventModal(div) {
	let save = false;
	const eventModal = document.querySelector(".event-creation");
	clicked = !clicked;
	if (clicked) {
		eventModal.style.display = "block";
		lastMadeEventId = takeSpace(div);
		addTitleToCreatedEvent();
	} else {
		eventModal.style.display = "none";
		if (!save) {
			releaseSpace();
		}
	}

	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		releaseSpace();
		hideCreateEventModal(eventModal);
	};

	const saveBtn = document.querySelector(".save-event-btn");
	saveBtn.onclick = () => {
		save = true;
		const inputedEventTitle = document.querySelector(".event-title");
		addTitleToCreatedEvent(inputedEventTitle.value);
		hideCreateEventModal(eventModal);
		lastMadeEventId = "";
		inputedEventTitle.value = "";
	};
}

function takeSpace(div) {
	const createdEvent = document.createElement("div");
	createdEvent.className = "created-event";
	createdEvent.id = div.id + "-event";
	div.appendChild(createdEvent);
	return createdEvent.id;
}

function addTitleToCreatedEvent(title) {
	const currEvent = document.getElementById(lastMadeEventId);
	if (!title) {
		currEvent.innerText = `(no title)`;
	} else {
		currEvent.innerText = `${title}`;
	}
}

function releaseSpace() {
	document.getElementById(lastMadeEventId).remove();
	const eventTitle = document.querySelector(".event-title");
	eventTitle.value = "";
}

function hideCreateEventModal(eventModal) {
	eventModal.style.display = "none";
	clicked = !clicked;
}
