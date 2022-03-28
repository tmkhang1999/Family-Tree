const add_button = document.getElementById("add-box")
const form = document.getElementById("form");
const submit = document.getElementById("submit");

add_button.onclick = function () {
    $("#add-modal").modal("show");
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
    const text = Array.from(document.querySelectorAll("#form input")).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    const id = Math.random().toString(36).substr(2, 9)
    const key = [id, text['message']]

    fetch(`${window.origin}/profile/add`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(key),
        cache: "no-cache",
        headers: new Headers({
        "content-type": "application/json"
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
            if (data['message'] === "OK") {
                create(key)
            }
        });
    }).catch(function (error) {
        console.log("Fetch error: " + error);
    });
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

    const trash = document.createElement("img");
    trash.setAttribute("class", "trash-img");
    trash.setAttribute("src", "/static/images/trash.png");
    trash.setAttribute("alt", "trash icon");
    trash.setAttribute("onclick", `deleteConfirm("${treeID}")`);

    const box = document.createElement("div");
    box.setAttribute('class', 'menu-box');
    box.setAttribute('id', `${treeID}`);

    box.appendChild(nameHolder);
    box.appendChild(trash);
    $(box).insertBefore("#add-box");
}

function deleteConfirm(element) {
    const deleteButton = document.getElementById("delete-button")
    deleteButton.setAttribute("onclick", `deleteTree("${element}")`)
    $("#delete-modal").modal("show");
}

function deleteTree(element) {
    fetch(`${window.origin}/profile/delete`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(element),
        cache: "no-cache",
        headers: new Headers({
        "content-type": "application/json"
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
            if (data['message'] === "OK") {
                const box = document.getElementById(element)
                box.remove()
            }
        });
    }).catch(function (error) {
        console.log("Fetch error:" + error);
    });


}