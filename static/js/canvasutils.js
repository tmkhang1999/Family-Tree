//HTML Selections
const canvas = document.querySelector('canvas');
const body = document.querySelector('body');
const memberForm = document.getElementById("memberForm");
const relationForm = document.getElementById("relationForm");
const newMemberButton = document.getElementById("newMember");
const newRelationButton = document.getElementById("newRelation");
const deleteMemberButton = document.getElementById("deleteMember");
const deleteRelationButton = document.getElementById("deleteRelation");
const formHeader = document.getElementById('formHeader');
const c = canvas.getContext('2d');

//Canvas Related Variables
let topLeftX = 0;
let topLeftY = 0;
let bottomRightX = 0;
let bottomRightY = 0;
const gridSize = 50;
const BorderSize = 5;

//ENUMERATIONS
const FORM_HEADERS = Object.freeze({
    EDIT_MEMBER : "Editing Member",
    CREATE_MEMBER : "Creating Member"
});

const FORM_INPUT_LABELS = Object.freeze({
    //more to come
    IMAGE : "image",
    NAME : "name",
    SEX : "sex",
    BIRTHPLACE : "birthPlace",
    BIRTHDATE : "birthDate",
    DIED : "died",
    DEATHDATE : "deathDate",
    NOTE : "note",
    DOTTED : "dotted",
    JUNCTION_TYPE : "junctionType"
});

const COLOR_PALETTE = Object.freeze({
    BG : "white",
    GRID_LINES : '#bbbbbb',
    MEMBER : "lightgray",
    RELATION_PLACE : "#999999",
    SELECTED : "green",
    FONT : "black",
    DEFAULT : "black"
});

const ZOOM_DEPTH = Object.freeze({
    MINIMUM : -0.5,
    MAXIMUM : 1
});

const RELATION_TYPE = Object.freeze({
    M_TO_M : "MM",
    M_TO_R : "MR"
});

//HTML INPUT HANDLING
function handleNewRelation()
{
    if(memberSelected !== -1){
        placeRelationMode = true;
        prevMemberSelected = memberSelected;
    }
}

function handleNewMember()
{
    memberForm.style.display = "block";
    memberSelected = -1;
    memberForm.reset();
    document.getElementById('formHeader').textContent = FORM_HEADERS.CREATE_MEMBER;
    deleteMemberButton.style.display = "none";
}

function handleDeleteMember()
{
    if(memberSelected !== -1){
        for (let i = 0; i < relations.length; i++)
        {
            console.log(relations[i]);
            if (relations[i].MemAID === members[memberSelected].id || relations[i].MemBID === members[memberSelected].id || relations[i].MemID === members[memberSelected].id)
            {
                relationSelected = i;
                handleDeleteRelation();
                i = -1;
            }
        }
        members.splice(memberSelected, 1);
    }
    memberSelected = -1;
    memberForm.reset();
    document.getElementById('formHeader').textContent = FORM_HEADERS.CREATE_MEMBER;
    deleteMemberButton.style.display = "none";

}

function handleDeleteRelation()
{
    if(relationSelected !== -1){
        for(let i = 0; i< relations.length; i++)
        {
            if(relations[i].RelID === relations[relationSelected].id){
                relations.splice(i,1);
                i = -1;
            }
        }
        relations.splice(relationSelected, 1);
    }
    relationSelected = -1;
    relationForm.style.display = "none";

}

function handleMemberForm(event)
{
    event.preventDefault();
    const text = document.getElementById('formHeader').textContent;

    let name = memberForm.elements[FORM_INPUT_LABELS.NAME].value;
    let sex = memberForm.elements[FORM_INPUT_LABELS.SEX].value;
    let birthPlace = memberForm.elements[FORM_INPUT_LABELS.BIRTHPLACE].value;
    let birthDate = memberForm.elements[FORM_INPUT_LABELS.BIRTHDATE].value;
    let deathDate = memberForm.elements[FORM_INPUT_LABELS.DEATHDATE].value;
    let note = memberForm.elements[FORM_INPUT_LABELS.NOTE].value;
    let imageSrc;
    let member;

    if(text === FORM_HEADERS.EDIT_MEMBER) {
        if(memberSelected !== -1) {
            members[memberSelected].updateInfo(name, sex, birthPlace, birthDate, false, deathDate, note);
            member = members[memberSelected]
        }
    } else if(text === FORM_HEADERS.CREATE_MEMBER) {
        newMember = new Member(0,0);
        newMember.updateInfo(name, sex, birthPlace, birthDate, false, deathDate, note);
        member = newMember;
        placeMemberMode = true;
    }

    const form_data = new FormData($('#memberForm')[0]);
    $.ajax({
        type: 'POST',
        url: `${window.origin}/saveImage/${treeID}/${member.id}`,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(response) {
            if (response['message'] === "OK") {
                imageSrc = response['image_path']
                member.setImage(imageSrc)
            }
        },
    });
}

function handleRelationForm(event)
{
    event.preventDefault();
    relations[relationSelected].dotted = relationForm.elements[FORM_INPUT_LABELS.DOTTED].checked;
    relations[relationSelected].mode = relationForm.elements[FORM_INPUT_LABELS.JUNCTION_TYPE].value;
}

function fillMemberForm()
{
    memberForm.style.display = "block";
    relationForm.style.display = "none";
    formHeader.textContent = FORM_HEADERS.EDIT_MEMBER;
    deleteMemberButton.style.display = "block";
    memberForm.elements[FORM_INPUT_LABELS.NAME].value = members[memberSelected].name;
    memberForm.elements[FORM_INPUT_LABELS.SEX].value = members[memberSelected].sex;
    memberForm.elements[FORM_INPUT_LABELS.BIRTHPLACE].value = members[memberSelected].birthPlace;
    memberForm.elements[FORM_INPUT_LABELS.BIRTHDATE].value = members[memberSelected].birthDate;
    memberForm.elements[FORM_INPUT_LABELS.DEATHDATE].value = members[memberSelected].deathDate;
    memberForm.elements[FORM_INPUT_LABELS.NOTE].value = members[memberSelected].note;
}

function fillRelationForm()
{
    relationForm.style.display = "block";
    memberForm.style.display = "none";
    relationForm.elements[FORM_INPUT_LABELS.DOTTED].checked = relations[relationSelected].dotted;
    relationForm.elements[FORM_INPUT_LABELS.JUNCTION_TYPE].value = relations[relationSelected].mode;
}

//DRAWING
function fillRoundedRect(canvas, x, y, width, height, radius, color = COLOR_PALETTE.DEFAULT)
{
    canvas.fillStyle = color;

    canvas.beginPath();
    canvas.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(x + width - radius, y + radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(x + radius, y + height - radius, radius, 0, Math.PI * 2, false);
    canvas.fill();

    canvas.fillRect(x, y + radius, width, height - radius * 2);
    canvas.fillRect(x + radius, y, width - radius * 2, height);
}

function line(canvas, x1, y1, x2, y2, width = 1, dotted = false, stroke = COLOR_PALETTE.DEFAULT)
{
    canvas.strokeStyle = stroke;
    canvas.lineWidth = width;

    canvas.lineCap = 'round';
    canvas.setLineDash((dotted) ? [0, gridSize] : []);
    canvas.beginPath();
    canvas.moveTo(x1,y1);
    canvas.lineTo(x2,y2);
    canvas.stroke();
}



function drawGrid()
{
    if(scalelevel < 1.5 && gridAligning)
    {
        for(let x = topLeftX; x <= bottomRightX; x += gridSize)
            for(let y = topLeftY; y <= bottomRightY; y += gridSize)
            {
                c.fillStyle = COLOR_PALETTE.GRID_LINES;
                c.fillRect(x, y, gridSize, gridSize);
                c.fillStyle = COLOR_PALETTE.BG;
                c.fillRect(x + 1, y + 1, gridSize - 1, gridSize - 1);
            }
    }
}


//DOWNLOADING AS IMAGE
function printCanvas()
{
    gridAligning = false;
    setCanvasImageBounds()
    gridAligning = true;
    let image = canvas.toDataURL("image/png");

    let a = document.createElement('a');
    a.href = image;
    a.download = "output.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

function setCanvasImageBounds()
{
    let top, bottom, left, right;

    for(let i = 0; i < members.length; i++)
    {
        if(i === 0)
        {
            bottom = members[i].y + 150;
            top = members[i].y;
            left = members[i].x;
            right = members[i].x + 100;
        }
        if(members[i].y < top)
        {
            top = members[i].y;
        }
        if(members[i].y + 150 > bottom)
        {
            bottom = members[i].y + 150;
        }
        if(members[i].x < left)
        {
            left = members[i].x;
        }
        if(members[i].x + 100 > right)
        {
            right = members[i].x + 100;
        }
    }

    canvas.width = right - left;
    canvas.height = bottom - top;

    c.translate(-left, -top);

    topLeftX = Math.floor(left / gridSize) * gridSize;
    topLeftY = Math.floor(top / gridSize) * gridSize;

    bottomRightX = Math.floor((right / scale) / gridSize) * gridSize;
    bottomRightY = Math.floor((bottom / scale) / gridSize) * gridSize;

    c.fillStyle = '#ffffff';
    c.fillRect(left, top, right - left, bottom-top);
    draw();
}


//COLLISION DETECTION
function inBounds(a, min, max, tolerance)
{
    return (a >= min - tolerance && a <= max + tolerance) || (a >= max - tolerance && a <= min + tolerance);
}

function pointOnVertical(x, y, y1, y2, lineY, tolerance)
{
    return (x > lineY - tolerance && x < lineY + tolerance && y > y1 && y < y2);
}

function pointOnHorizontal(x, y, x1, x2, lineX, tolerance)
{
    return (x > x1 && x < x2 && y > lineX - tolerance && y < lineX + tolerance);
}