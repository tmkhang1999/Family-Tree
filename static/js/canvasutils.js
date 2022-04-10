
//ENUMERATIONS
const FORM_HEADERS = Object.freeze({
    EDIT_MEMBER : "Editing Member",
    CREATE : "Creating Member"
});

const FORM_INPUT_LABELS = Object.freeze({
    NAME : "name",
    BIRTHPLACE : "birthPlace",
    BIRTHDATE : "birthDate",
    NOTE : "note"
    //more to come
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
    MINIMUM : 1,
    MAXIMUM : -0.5
});



//HTML INPUT HANDLING
function handleNewRelation(event)
{

}

function handleNewMember(event)
{
    memberSelected = -1;
    memberForm.reset();
    document.getElementById('formHeader').textContent = FORM_HEADERS.CREATE;
    deleteMemberButton.style.display = "none";
}

function handleDeleteMember(event)
{
    if(memberSelected != -1){
        members.splice(memberSelected, 1); 
    }
    memberSelected = -1;
    memberForm.reset();
    document.getElementById('formHeader').textContent = FORM_HEADERS.CREATE;
    deleteMemberButton.style.display = "none";

}

function handleForm(event)
{ 
    event.preventDefault();
    var text = document.getElementById('formHeader').textContent;

    var name = memberForm.elements[FORM_INPUT_LABELS.NAME].value;
    var birthPlace = memberForm.elements[FORM_INPUT_LABELS.BIRTHPLACE].value;
    var birthDate = memberForm.elements[FORM_INPUT_LABELS.BIRTHDATE].value;
    var note = memberForm.elements[FORM_INPUT_LABELS.NOTE].value;

    if(text == FORM_HEADERS.EDIT_MEMBER)
    {
        if(memberSelected != -1)
        {
            members[memberSelected].updateInfo(name, birthPlace, birthDate, note);
        }
    }
    else if(text == FORM_HEADERS.CREATE)
    {
        newMember = new Member(0,0);
        newMember.updateInfo(name, birthPlace, birthDate, note);
        placeMemberMode = true;
    }
} 

function fillForm()
{ 
    document.getElementById('formHeader').textContent = FORM_HEADERS.EDIT_MEMBER;
    deleteMemberButton.style.display = "block";
    memberForm.elements[FORM_INPUT_LABELS.NAME].value = members[memberSelected].name;
    memberForm.elements[FORM_INPUT_LABELS.BIRTHPLACE].value = members[memberSelected].birthPlace;
    memberForm.elements[FORM_INPUT_LABELS.BIRTHDATE].value = members[memberSelected].birthDate;
    memberForm.elements[FORM_INPUT_LABELS.NOTE].value = members[memberSelected].note;
} 



// DRAWING FUNCTIONS
function fillRoundedRect(canvas, x, y, width, height, color, radius)
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

function line(canvas, x1, y1, x2, y2, stroke = COLOR_PALETTE.DEFAULT, width = 1)
{
    if (stroke) {
        canvas.strokeStyle = stroke;
    }

    if (width) {
        canvas.lineWidth = width;
    }
    canvas.lineCap = 'round';
    canvas.beginPath();
    canvas.moveTo(x1,y1);
    canvas.lineTo(x2,y2);
    canvas.stroke();
}

function stepLine(canvas, x1, y1, x2, y2, midX = 0, midY = 0, stroke = COLOR_PALETTE.DEFAULT, width = 1)
{
    if(midY == 0)
    {
        line(canvas, x1, y1 , midX, y1, stroke,width);
        line(canvas, midX, y1, midX, y2, stroke, width);
        line(canvas, midX, y2, x2, y2, stroke, width);
    }
    else if (midX == 0)
    {
        line(canvas, x1, y1 , x1, midY, stroke, width);
        line(canvas, x1, midY, x2, midY, stroke, width);
        line(canvas, x2, midY, x2, y2, stroke, width);
    }
}

function ULine(canvas, x1, y1, x2, y2, xOff = 0, yOff = 0, stroke = COLOR_PALETTE.DEFAULT, width = 1)
{
    if(xOff == 0)
    {
        line(canvas, x1, y1, x1, y1 + yOff, stroke, width);
        line(canvas, x1, y1 + yOff, x2, y2 + yOff, stroke, width);
        line(canvas, x2, y2 + yOff, x2, y2, stroke, width);
    }
    else if(yOff == 0)
    {
        line(canvas,x1, y1, x1 + xOff, y1, stroke, width);
        line(canvas,x1 + xOff, y1, x2 + xOff, y2, stroke, width);
        line(canvas,x2 + xOff, y2, x2, y2, stroke, width);
    }
}



//COLLISION DETECTION

function inBounds(x, x1, x2, tolerance)
{
    return (x >= x1 - tolerance && x <= x2 + tolerance) || (x >= x2 - tolerance && x <= x1 + tolerance);
}
function pointOnLine(x, y, x1, y1, x2, y2, tolerance)
{
    if (x1 == x2 && inBounds(x,x1,x2, tolerance))
    {
       return true;
    }
    var  m = (y2 - y1) / (x2 - x1);
    var  b = -(m * x1) + y1;
    if((Math.abs (y - (m * x + b)) <= tolerance)){
      return true;
    }
    return false;
}


