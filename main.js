let API = "http://localhost:8000/contacts";

let createContactBtn = document.querySelector(".create-contact");
let createContactModal = document.querySelector(".create-contact-modal");
let content = document.querySelector(".content");
let contactCreaterBtn = document.querySelector(".contact-creator-btn");
let modalCloseBtn = document.querySelector(".modal-close-btn");
let modalCloseBtn2 = document.querySelector(".modal-close-btn2");
let saveContactBtn = document.querySelector(".contact-save-btn");
let editModal = document.querySelector(".edit-contact-modal");

//! search
let searchInp = document.querySelector("#search");
let searchVal = "";

//! инпуты для данных контакта
let contactName = document.querySelector("#name");
let contactLastname = document.querySelector("#lastname");
let contactEmail = document.querySelector("#email");
let contactImg = document.querySelector("#img");

// !инпуты для редактирования контакта
let editContactName = document.querySelector("#editName");
let editContactLastname = document.querySelector("#editLastname");
let editContactEmail = document.querySelector("#editEmail");
let editContactImg = document.querySelector("#editImg");

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

modalCloseBtn2.addEventListener("click", () => {
    editModal.style.display = "none";
    content.style.display = "flex";
});

//! кнопка создания нового контакта
contactCreaterBtn.addEventListener("click", async function () {
    let newContact = {
        name: contactName.value,
        lastname: contactLastname.value,
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
    contactLastname.value = "";
    contactEmail.value = "";
    contactImg.value = "";

    render();
});

//! создание контактов
let contactList = document.querySelector(".contacts");
async function render() {
    let contacts = await fetch(`${API}?q=${searchVal}`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    contactList.innerHTML = "";
    contacts.forEach((element) => {
        if (element.image == "") {
            element.image = "./icons/iconAvatar2.png";
        }
        if (element.name == "") {
            element.name = "/no name";
        }
        if (element.lastname == "") {
            element.lastname = "/no lastname";
        }
        if (element.email == "") {
            element.email = "/no email";
        }

        let newContactCard = document.createElement("div");
        newContactCard.className = "contact-card";
        newContactCard.id = element.id;
        newContactCard.innerHTML = `<div class="contact-card-image">
                                <div class="image"><img src=${element.image}></div>
                            </div>
                            <div class="card-info">
                                <span>${element.name}..</span> <span>${element.lastname}</span>
                                <p>${element.email}</p>
                            </div>
                            <div class="card-buttons">
                                <button id=${element.id} class="contact-edit">Edit</button>
                                <button id=${element.id} class="contact-delete" onclick='deleteContact(${element.id})'>Delete</button>
                            </div>`;
        contactList.append(newContactCard);
    });
}
render();

//! удаление контакта
function deleteContact(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
}

//! поиск контакта
searchInp.addEventListener("input", () => {
    searchVal = searchInp.value;
    render();
});

//! редактирование контакта
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("contact-edit")) {
        editModal.style.display = "flex";
        content.style.display = "none";
        createContactModal.style.display = "none";
        let id = e.target.id;
        fetch(`${API}/${id}`).then((res) =>
            res.json().then((data) => {
                editContactName.value = data.name;
                editContactLastname.value = data.lastname;
                editContactEmail.value = data.email;
                editContactImg.value = data.image;
                saveContactBtn.setAttribute("id", data.id);
            })
        );
    }
});

//! сохранение контакта
saveContactBtn.addEventListener("click", function () {
    let id = this.id;
    let lastname = editContactLastname.value;
    let name = editContactName.value;
    let email = editContactEmail.value;
    let img = editContactImg.value;
    if (img == "") {
        img = "./icons/iconAvatar2.png";
    }
    if (name == "") {
        name = "/no name";
    }
    if (email == "") {
        email = "/no email";
    }
    if (lastname == "") {
        lastname = "/no lastname";
    }

    let editedContact = {
        name: name,
        lastname: lastname,
        email: email,
        image: img,
    };
    saveContact(editedContact, id);
});

function saveContact(editedContact, id) {
    fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json; carset=utf-8" },
        body: JSON.stringify(editedContact),
    }).then(() => render());
    editModal.style.display = "none";
    content.style.display = "flex";
}

function sortBy() {
    let sorted = [];
    fetch(API)
        .then((res) => res.json())
        .then((data) => {
            sorted = data;
        });
    console.log(sorted);
}
sortBy();
