class Member
{
    //movement Info
    offsetX = -1;
    offsetY = -1;
    width = 100;
    imageDim = 75;
    height = 150;
    defaultCornerRad = 20;
    isMoving = false;
    selected = false;

    //Member Info
    name = "";
    image = new Image();
    birthPlace = "";
    birthDate = new Date();
    note = "";
    sex = '';
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.image.src = "person0.jpeg";
    }

    setName(name)
    {
        this.name = name;
        console.log("name Set:", this.name);
    }

    setBirthDate(date)
    {
        this.birthDate = date;
        console.log("date Set:", this.date);
    }

    setBirthPlace(birthPlace)
    {
        this.birthPlace = birthPlace;
        console.log("birthPlace Set:", this.birthPlace);
    }

    setSex(sex)
    {
        this.birthPlace = sex[0];
    }

    setNote(note)
    {
        this.note = note;
        console.log("note Set:", this.note);
    }

    draw(canvas)
    {
        if(this.selected)
        {
            fillRoundedRect(c, this.x - BorderOffset, this.y - BorderOffset,  this.width + (BorderOffset * 2), this.height + (BorderOffset * 2), "green", this.defaultCornerRad + BorderOffset);
        }
        fillRoundedRect(canvas, this.x, this.y,this.width, this.height, "gray", this.defaultCornerRad);
        canvas.fillStyle = 'black';
        canvas.textAlign = 'center';
        canvas.fillText(this.name, this.x + this.width / 2, this.y + 3 * this.height / 4);
        canvas.drawImage(this.image, this.x + this.width / 8, this.y + this.width / 8, this.imageDim, this.imageDim);
    }

    isHovering(mouseX, mouseY)
    {
        if(mouseX > (this.x - cameraX) * scale && mouseX < (this.x + this.width - cameraX) * scale && mouseY > (this.y - cameraY) * scale && mouseY < (this.y + this.height - cameraY) * scale)
        {
            return true;
        }
        return false
    }

    update()
    {
        if(this.isMoving)
        {
            if(this.offsetX == -1 && this.offsetY == -1)
            {
                this.offsetX = mouseX / scale + cameraX - this.x;
                this.offsetY = mouseY / scale + cameraY - this.y;
            }
            if(gridAligning)
            {
                this.x = Math.floor((mouseX / scale + cameraX - this.offsetX) / gridSize) * gridSize;
                this.y = Math.floor((mouseY / scale + cameraY - this.offsetY) / gridSize) * gridSize;
            }
            else
            {
                this.x = mouseX / scale + cameraX - this.offsetX;
                this.y = mouseY / scale + cameraY - this.offsetY;
            }
        }
        else
        {
            this.offsetX = -1;
            this.offsetY = -1;
        }
    }

    collides(x,y)
    {
        //collision detection for memeber boxes
        return false;
    }
}