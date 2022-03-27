const add_button = document.getElementById("add-box")
const form = document.getElementById("form");
const submit = document.getElementById("submit");

add_button.onclick = function () {
    $("#modal").modal("show");
}

submit.onmousemove = function () {
    if (form.checkValidity() === true) {
        document.getElementById("submit").setAttribute("data-bs-dismiss", "modal");
    } else {
        document.getElementById("submit").removeAttribute("data-bs-dismiss");
    }
}

form.onsubmit = function (event) {
    event.preventDefault();
    const text = Array.from(document.querySelectorAll("#form input")).reduce((acc, input) => ({...acc, [input.id]: input.value}), {});
    const id = Math.random().toString(36).substr(2, 9)
    let key = [id, text['message']]
    create(key)
}

function create(key) {
    let treeID = null;
    let treeName = "New Box";
    if (key) {
        treeID = key[0];
        treeName = key[1];
    }

    const name = document.createTextNode(treeName);
    const nameHolder = document.createElement("a");
    nameHolder.setAttribute('class', 'tree-name');
    nameHolder.appendChild(name);

    const id = document.createTextNode(treeID);
    const idHolder = document.createElement("a");
    idHolder.setAttribute('class', 'tree-id');
    idHolder.setAttribute("style", "display:none");
    idHolder.appendChild(id);

    const trash = document.createElement("img");
    trash.setAttribute("class", "trash-img");
    trash.setAttribute("src", "/static/images/trash.png");
    trash.setAttribute("alt", "trash icon");
    trash.setAttribute("onclick", "deleteTree(this)");

    const box = document.createElement("div");
    box.setAttribute('class', 'menu-box');

    box.appendChild(nameHolder);
    box.appendChild(idHolder);
    box.appendChild(trash);
    $(box).insertBefore("#add-box");
}

function deleteTree(element) {
    $(element).parent('div').remove();
}