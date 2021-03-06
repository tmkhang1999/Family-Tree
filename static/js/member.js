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
    imageSrc = "";
    name = "";
    sex = '';
    birthDate = "";
    birthPlace = "";
    deathDate = "";
    note = "";

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.id = Math.random();

        for (let i = 0; i < members.length; i++) {
            if(this !== members[i]){
                if(this.id === members[i].id){
                    this.id = Math.random();
                    i = 0;
                }
            }
        }
    }

    setImage(imageSrc)
    {
        let location = `${window.location.protocol}//${window.location.host}/`;
        if (imageSrc) {
            this.imageSrc = imageSrc;
        } else {
            this.imageSrc = "static/images/person0.png";
        }
        this.image.crossOrigin = "anonymous";
        this.image.src = location + this.imageSrc;
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
            fillRoundedRect(c, this.x - BorderSize, this.y - BorderSize,  Member.width + (BorderSize * 2), Member.height + (BorderSize * 2), Member.cornerRad + BorderSize, COLOR_PALETTE.SELECTED);
        }
        fillRoundedRect(canvas, this.x, this.y,Member.width, Member.height, Member.cornerRad, COLOR_PALETTE.MEMBER);
        canvas.fillStyle = COLOR_PALETTE.FONT;
        canvas.textAlign = 'center';
        canvas.fillText(this.name, this.x + Member.width / 2, this.y + 3 * Member.height / 4);
        try
        {
            canvas.drawImage(this.image, this.x + Member.width / 8, this.y + Member.width / 8, Member.imageDim, Member.imageDim);
        }
        catch(e){
            console.log("could not load image");
        }
    }

    isHovering(mouseX, mouseY)
    {
        let xInBounds = inBounds(mouseX, (this.x - cameraX) * scale, (this.x + Member.width - cameraX) * scale, 0);
        let yInBounds = inBounds(mouseY, (this.y - cameraY) * scale, (this.y + Member.height - cameraY) * scale, 0)
        return !!(xInBounds && yInBounds);

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

    updateInfo(name, sex, birthPlace, birthDate, deathDate, note){
        this.name = name;
        this.sex = sex;
        this.birthPlace = birthPlace;
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.note = note;
    }
}