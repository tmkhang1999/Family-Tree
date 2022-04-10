class Member
{
    //Dimensions Info
    width = gridSize * 2;
    height = gridSize * 3;
    defaultCornerRad = gridSize / 2;
    imageDim = gridSize * 2 - gridSize / 2;

    //Movement Info
    offsetX = -1;
    offsetY = -1;
    isMoving = false;
    selected = false;

    //Member Info
    name = "";
    image = new Image();
    birthPlace = "";
    birthDate = "";
    note = "";
    sex = '';
    
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.image.src = "person0.jpeg";
    }

    setSex(sex)
    {
        this.sex = sex[0];
    }

    setPosition(x,y)
    {
        this.x = x;
        this.y = y;
    }

    draw(canvas)
    {
        if(this.selected)
        {
            fillRoundedRect(c, this.x - BorderOffset, this.y - BorderOffset,  this.width + (BorderOffset * 2), this.height + (BorderOffset * 2), COLOR_PALETTE.SELECTED, this.defaultCornerRad + BorderOffset);
        }
        fillRoundedRect(canvas, this.x, this.y,this.width, this.height, COLOR_PALETTE.MEMBER, this.defaultCornerRad);
        canvas.fillStyle = COLOR_PALETTE.FONT;
        canvas.textAlign = 'center';
        canvas.fillText(this.name, this.x + this.width / 2, this.y + 3 * this.height / 4);
        canvas.drawImage(this.image, this.x + this.width / 8, this.y + this.width / 8, this.imageDim, this.imageDim);
    }

    isHovering(mouseX, mouseY)
    {
        var xInBounds = inBounds(mouseX, (this.x - cameraX) * scale, (this.x + this.width - cameraX) * scale, 0);
        var yInBounds = inBounds(mouseY, (this.y - cameraY) * scale, (this.y + this.height - cameraY) * scale, 0)
        if(xInBounds && yInBounds)
        {
            return true;
        }
        return false

        // if(mouseX > (this.x - cameraX) * scale && mouseX < (this.x + this.width - cameraX) * scale && mouseY > (this.y - cameraY) * scale && mouseY < (this.y + this.height - cameraY) * scale)
        // {
        //     return true;
        // }
        // return false
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

    updateInfo(name, birthPlace = "", birthDate = "", note = ""){
        this.name = name;
        this.birthPlace = birthPlace;
        this.note = note;
        this.birthDate = birthDate;
    }

    collides(x,y)
    {
        //collision detection for memeber boxes
        return false;
    }
}