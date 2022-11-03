let API = "http://localhost:8000/contacts";

let createContactBtn = document.querySelector(".create-contact");
let createContactModal = document.querySelector(".create-contact-modal");
let content = document.querySelector(".content");
let contactCreaterBtn = document.querySelector(".contact-creator-btn");
let modalCloseBtn = document.querySelector(".modal-close-btn");

//! search
let searchInp = document.querySelector("#search");
let searchVal = "";

//! инпуты для данных контакта
let contactName = document.querySelector("#name");
let contactEmail = document.querySelector("#email");
let contactImg = document.querySelector("#img");

//! кнопка открытия модального окна для создаяния контакта
createContactBtn.addEventListener("click", () => {
    createContactModal.style.display = "flex";
    content.style.display = "none";
});
//! просто крестик закрыть модалку
modalCloseBtn.addEventListener("click", () => {
    createContactModal.style.display = "none";
    content.style.display = "flex";
});

//! кнопка создания нового контакта
contactCreaterBtn.addEventListener("click", async function () {
    let newContact = {
        name: contactName.value,
        email: contactEmail.value,
        image: contactImg.value,
    };
    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(newContact),
    });
    contactName.value = "";
    contactEmail.value = "";
    contactImg.value = "";

    render();
});

let contactList = document.querySelector(".contacts");

async function render() {
    let contacts = await fetch(`${API}?q=${searchVal}`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    contactList.innerHTML = "";
    contacts.forEach((element) => {
        if (element.image == "") {
            element.image = "./icons/iconAvatar.png";
        }
        let newContactCard = document.createElement("div");
        newContactCard.className = "contact-card";
        newContactCard.id = element.id;
        newContactCard.innerHTML = `<div class="contact-card-image">
                                <div class="image"><img src=${element.image}></div>
                            </div>
                            <div class="card-info">
                                <p>${element.name}</p>
                                <p>${element.email}</p>
                            </div>
                            <div class="card-buttons">
                                <button class="contact-edit">Edit</button>
                                <button class="contact-delete" onclick='deleteContact(${element.id})'>Delete</button>
                            </div>`;
        contactList.append(newContactCard);
    });
}
render();

function deleteContact(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
}

searchInp.addEventListener("input", () => {
    searchVal = searchInp.value;
    render();
});
