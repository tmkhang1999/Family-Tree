class Button
{
    colorIdle = "#444444";
    colorHover = "#777777";
    colorPressed = "#999999";

    textColor = "#ffffff";

    offsetX = 0;
    offsetY = 0;

    color = this.colorIdle;

    textSize = 30;

    toggle = false;

    constructor(x, y, width, height, text)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }

    pressed(lmb)
    {
        if(this.toggle && !lmb)
        {
            this.toggle = false;
            return true;
        }
        return false;
    }

    draw(canvas)
    {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.fillStyle = this.textColor;
        canvas.font = this.textSize + 'px sans-serif';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.fillText(this.text, this.x + this.offsetX + this.width / 2, this.y + this.offsetY + this.height / 2, this.width);
    }

    update(lmb, mouseX, mouseY)
    {
        this.color = this.colorIdle;
        if(mouseX > this.x && mouseY > this.y && mouseX < this.x + this.width && mouseY < this.y + this.height)
        {
            this.color = this.colorHover;
            if(lmb)
            {
                this.color = this.colorPressed;
                this.toggle = true;
            }
        }

        if(!lmb)
        {
            this.toggle = false;
        }
    }
}

class Slider
{
    colorIdle = "#444444";
    colorHover = "#777777";
    colorPressed = "#999999";

    colorSlider = "#222222";

    colorCurrent = this.colorIdle;

    isMoving = false;

    constructor(x, y, length, thickness, boxWidth, boxHeight, position)
    {
        this.x = x;
        this.y = y;
        this.length = length;
        this.thickness = thickness;
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.position = position;
    }

    draw(canvas)
    {
        canvas.fillStyle = this.colorSlider;
        canvas.fillRect(this.x, this.y - this.thickness / 2, this.length, this.thickness / 2);
        canvas.fillStyle = this.colorCurrent;
        canvas.fillRect(this.x - this.boxWidth / 2 + this.position * this.length, this.y - this.boxHeight / 2, this.boxWidth, this.boxHeight);
    }

    getPosition()
    {
        return this.position;
    }

    update(lmb, mouseX, mouseY)
    {
        this.colorCurrent = this.colorIdle;
        if(mouseX > this.x - this.boxWidth / 2 + this.position * this.length && mouseY > this.y - this.boxHeight / 2 && mouseX < this.x + this.boxWidth / 2 + this.position * this.length && mouseY < this.y + this.boxHeight / 2)
        {
            this.colorCurrent = this.colorHover;
            if(lmb)
            {
                this.isMoving = true;
            }
        }

        if(this.isMoving)
        {
            this.colorCurrent = this.colorPressed;
            this.position = (mouseX - this.x) / this.length;
        }
        
        if(!lmb)
        {
            this.isMoving = false;
        }

        if(this.position < 0) this.position = 0;
        if(this.position > 1) this.position = 1;
    }
}

class TextField
{
    text = "";
    selected = false;

    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(canvas)
    {
        if(!this.selected) canvas.fillStyle = "#cccccc";
        else canvas.fillStyle = "#ffffff";

        canvas.fillRect(this.x, this.y, this.width, this.height);

        canvas.fillStyle = "#202020";
        canvas.font = "18px sans-serif";
        canvas.fillText(this.text, this.x + 2, this.y - (this.height / 5) + this.height, this.width);
    }

    update(lmb, mouseX, mouseY)
    {
        if(lmb)
        {
            if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height)
            {
                this.selected = true;
            }
            else
            {
                this.selected = false;
            }
        }
    }
}


function handleForm(event)
{ 
    event.preventDefault();
    if(memberSelected != -1)
    {
    var name = form.elements["name"].value;
    var birthPlace = form.elements["birthPlace"].value;
    var note = form.elements["note"].value
        updateMember(name, birthPlace, note);
    }
} 

function updateMember(name, birthplace = "", note = ""){
    console.log(name, birthplace, note);
    members[memberSelected].setName(name);
    members[memberSelected].setBirthPlace(birthplace);
    members[memberSelected].setNote(note);
}


function fillForm()
{ 
    form.elements["name"].value = members[memberSelected].name;
    form.elements["birthPlace"].value = members[memberSelected].birthPlace;
    form.elements["note"].value = members[memberSelected].note;
} 

function parseDate(date){   
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear()+"-"+(month)+"-"+(day) ;
}

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

function line(canvas, x1, y1, x2, y2, stroke = 'black', width = 1)
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

function stepLine(canvas,x1,y1,x2,y2,midX = 0,midY = 0, stroke = "black", width = 1){
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

function ULine(canvas,x1,y1,x2,y2,xOff = 0,yOff = 0, stroke = "black", width = 1)
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