"use strict";

let clicked = false;
let lastMadeEventId;

export function openCreateEventModal(div) {
    eventModal.style.display = "block";
	createEvent(div);
}

function createEvent(div) {
	let save = false;

	const eventModal = document.querySelector(".event-creation");
	clicked = !clicked;
	if (clicked) {
		eventModal.style.display = "block";
		lastMadeEventId = takeSpace(div);
	} else {
		eventModal.style.display = "none";
	}

	const exitBtn = document.querySelector(".exit-event-modal");
	exitBtn.onclick = () => {
		document.getElementById(lastMadeEventId).remove();
		eventModal.style.display = "none";
	};

	const saveBtn = document.querySelector(".save-event-btn");
	saveBtn.onclick = () => {
		save = true;
		eventModal.style.display = "none";
		lastMadeEventId = "";
	};

	if (!clicked && !save) {
		document.getElementById(lastMadeEventId).remove();
		eventModal.style.display = "none";
	}
}

function takeSpace(div) {
	const selectedSpot = document.getElementById(div.id);
	const eventTitle = document.querySelector(".event-title");

	const createdEvent = document.createElement("div");
	createdEvent.className = "created-event";
	createdEvent.id = div.id + "-event";
	selectedSpot.appendChild(createdEvent);
	if (!eventTitle.value) {
		createdEvent.innerText = `(no title)`;
	}
	eventTitle.addEventListener("input", () => {
		createdEvent.innerText = `${eventTitle.value}`;
	});
	return createdEvent.id;
}
