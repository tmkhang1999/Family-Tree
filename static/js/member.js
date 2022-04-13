class Member
{
    //Dimensions Info
    static width = gridSize * 2;
    static height = gridSize * 3;
    static cornerRad = gridSize / 2;
    static imageDim = 2 * gridSize - gridSize / 2;

    //Movement Info
    offsetX = -1;
    offsetY = -1;
    isMoving = false;
    selected = false;

    //Member Info
    image = new Image();
    name = "";
    sex = '';
    birthDate = "";
    birthPlace = "";
    died = false;
    deathDate = "";
    note = "";
    
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
            fillRoundedRect(c, this.x - BorderSize, this.y - BorderSize,  Member.width + (BorderSize * 2), Member.height + (BorderSize * 2), COLOR_PALETTE.SELECTED, Member.cornerRad + BorderSize);
        }
        fillRoundedRect(canvas, this.x, this.y,Member.width, Member.height, COLOR_PALETTE.MEMBER, Member.cornerRad);
        canvas.fillStyle = COLOR_PALETTE.FONT;
        canvas.textAlign = 'center';
        canvas.fillText(this.name, this.x + Member.width / 2, this.y + 3 * Member.height / 4);
        canvas.drawImage(this.image, this.x + Member.width / 8, this.y + Member.width / 8, Member.imageDim, Member.imageDim);
    }

    isHovering(mouseX, mouseY)
    {
        let xInBounds = inBounds(mouseX, (this.x - cameraX) * scale, (this.x + Member.width - cameraX) * scale, 0);
        let yInBounds = inBounds(mouseY, (this.y - cameraY) * scale, (this.y + Member.height - cameraY) * scale, 0)
        return !!(xInBounds && yInBounds);


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
            if(this.offsetX === -1 && this.offsetY === -1)
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

}