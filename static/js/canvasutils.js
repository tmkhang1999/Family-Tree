//HTML Selections
const canvas = document.querySelector('canvas');
const body = document.querySelector('body');
const memberForm = document.getElementById("memberForm");
const newMemberButton = document.getElementById("newMember");
const newRelationButton = document.getElementById("newRelation");
const deleteMemberButton = document.getElementById("deleteMember");
const formHeader = document.getElementById('formHeader');
const c = canvas.getContext('2d');

//Canvas Related Variables
let topLeftX = 0;
let topLeftY = 0;
let bottomRightX = 0;
let bottomRightY = 0;
let gridAligning = true;
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
    NOTE : "note"
});

const COLOR_PALETTE = Object.freeze({
    BG : "white",
    GRID_LINES : '#bbbbbb',
    MEMBER : "gray",
    RELATION : "black",
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
        members.splice(memberSelected, 1);
    }
    memberSelected = -1;
    memberForm.reset();
    document.getElementById('formHeader').textContent = FORM_HEADERS.CREATE_MEMBER;
    deleteMemberButton.style.display = "none";

}

function handleForm(event)
{
    event.preventDefault();
    const text = document.getElementById('formHeader').textContent;

    const form_data = new FormData($('#memberForm')[0]);
    $.ajax({
        type: 'POST',
        url: `${window.origin}/saveImage/${treeID}`,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(response) {
            if (response['message'] === "OK") {
                console.log(response['image_path']);
            }
        },
    });

    let name = memberForm.elements[FORM_INPUT_LABELS.NAME].value;
    let sex = memberForm.elements[FORM_INPUT_LABELS.SEX].value;
    let birthPlace = memberForm.elements[FORM_INPUT_LABELS.BIRTHPLACE].value;
    let birthDate = memberForm.elements[FORM_INPUT_LABELS.BIRTHDATE].value;
    let deathDate = memberForm.elements[FORM_INPUT_LABELS.DEATHDATE].value;
    let note = memberForm.elements[FORM_INPUT_LABELS.NOTE].value;

    const form_data = new FormData($('#memberForm')[0]);
    $.ajax({
        type: 'POST',
        url: `${window.origin}/saveImage/${treeID}`,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(response) {
            if (response['message'] === "OK") {
                console.log(response['image_path']);
            }
        },
    });

    if(text === FORM_HEADERS.EDIT_MEMBER)
    {
        if(memberSelected !== -1)
        {
            members[memberSelected].updateInfo(name, sex, birthPlace, birthDate, false, deathDate,note);
        }
    }
    else if(text === FORM_HEADERS.CREATE_MEMBER)
    {
        newMember = new Member(0,0);
        newMember.updateInfo(name, sex, birthPlace, birthDate, false, deathDate, note);
        placeMemberMode = true;
    }
}

function fillForm()
{
    memberForm.style.display = "block";
    formHeader.textContent = FORM_HEADERS.EDIT_MEMBER;
    deleteMemberButton.style.display = "block";
    memberForm.elements[FORM_INPUT_LABELS.NAME].value = members[memberSelected].name;
    memberForm.elements[FORM_INPUT_LABELS.SEX].value = members[memberSelected].sex;
    memberForm.elements[FORM_INPUT_LABELS.BIRTHPLACE].value = members[memberSelected].birthPlace;
    memberForm.elements[FORM_INPUT_LABELS.BIRTHDATE].value = members[memberSelected].birthDate;
    memberForm.elements[FORM_INPUT_LABELS.DEATHDATE].value = members[memberSelected].deathDate;
    memberForm.elements[FORM_INPUT_LABELS.NOTE].value = members[memberSelected].note;
}

// DRAWING FUNCTIONS
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

function line(canvas, x1, y1, x2, y2, width = 1, stroke = COLOR_PALETTE.DEFAULT)
{
    canvas.strokeStyle = stroke;
    canvas.lineWidth = width;

    canvas.lineCap = 'round';
    canvas.beginPath();
    canvas.moveTo(x1,y1);
    canvas.lineTo(x2,y2);
    canvas.stroke();
}

function stepLine(canvas,x1,y1,x2,y2,midX = 0,midY = 0, width = 1,stroke = COLOR_PALETTE.DEFAULT)
{
    if(midY === 0)
    {
        line(canvas, x1, y1 , midX, y1, stroke,width);
        line(canvas, midX, y1, midX, y2, stroke, width);
        line(canvas, midX, y2, x2, y2, stroke, width);
    }
    else if (midX === 0)
    {
        line(canvas, x1, y1 , x1, midY, stroke, width);
        line(canvas, x1, midY, x2, midY, stroke, width);
        line(canvas, x2, midY, x2, y2, stroke, width);
    }
}

function ULine(canvas,x1,y1,x2,y2,xOff = 0,yOff = 0, width = 1, stroke = COLOR_PALETTE.DEFAULT)
{
    if(xOff === 0)
    {
        line(canvas, x1, y1, x1, y1 + yOff, stroke, width);
        line(canvas, x1, y1 + yOff, x2, y2 + yOff, stroke, width);
        line(canvas, x2, y2 + yOff, x2, y2, stroke, width);
    }
    else if(yOff === 0)
    {
        line(canvas,x1, y1, x1 + xOff, y1, stroke, width);
        line(canvas,x1 + xOff, y1, x2 + xOff, y2, stroke, width);
        line(canvas,x2 + xOff, y2, x2, y2, stroke, width);
    }
}

//moved from canvas
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


//COLLISION DETECTION
function inBounds(x, x1, x2, tolerance)
{
    return (x >= x1 - tolerance && x <= x2 + tolerance) || (x >= x2 - tolerance && x <= x1 + tolerance);
}

function pointOnVertical(x, y, y1, y2, lineY, tolerance)
{
    return (x > lineY - tolerance && x < lineY + tolerance && y > y1 && y < y2);
}

function pointOnHorizontal(x, y, x1, x2, lineX, tolerance)
{
    return (x > x1 && x < x2 && y > lineX - tolerance && y < lineX + tolerance);
}