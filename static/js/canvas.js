
//HTML Selections
const canvas = document.querySelector('canvas');
const body = document.querySelector('body');

const memberForm = document.getElementById("memberForm");
const newMemberButton = document.getElementById("newMember");
const newRelationButton = document.getElementById("newRelation");
const deleteMemberButton = document.getElementById("deleteMember");

const c = canvas.getContext('2d');

//Camera Related Variables
let cameraX = 0;
let cameraY = 0;
let scale = 1;
let scalelevel = 0;

//Selection Variables
let relationSelected = -1;
let memberSelected = -1;

//Modes
let placeMemberMode = false;

//Input Variables
let mouseX = 0;
let mouseY = 0;
let newMemberX = 0;
let newMemberY = 0;
const movementDir = {
    "up": false,
    "down": false,
    "left": false,
    "right": false
};

//Member + Relation Variables
let newMember = null;
let members = [];
let relations = [];


//Call the LoadTree function here!!!
//loadTree(jsonFile);

function mousePressed(event)
{
    if(event.target === canvas)
    {
        let x = event.clientX;
        let y = event.clientY;
    
        memberSelected = -1;
        relationSelected = -1;
        memberForm.reset();
        if(event.button === 0 && !placeMemberMode)
        {
            for(let i = 0; i < members.length; i++)
            {
                if(members[i].isHovering(x, y))
                {
                    members[i].isMoving = true;
                    memberSelected = i;
                    fillForm();
                }
            }
    
            for(let i = 0; i < relations.length; i++)
            {
                if(relations[i].isHovering(x, y))
                {
                    relations[i].isMoving = true;
                    relationSelected = i;
                }
            }
        }
        else if(event.button === 0 && placeMemberMode && newMember != null)
        {
            newMember.setPosition(newMemberX,newMemberY);
            members.push(newMember);
            newMember = null;
            placeMemberMode = false;
        }
    }
}

function mouseMoved(event)
{
    if(event.target === canvas)
    {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if(relationSelected !== -1){
            relations[relationSelected].update(event.clientX,event.clientY, event.movementX, event.movementY);
        }
    }
}

function mouseReleased(event)
{
    if(event.target === canvas)
    {
        if(event.button === 0)
        {
            for(let i = 0; i < members.length; i++)
            {
                members[i].isMoving = false;
            }
            for(let i = 0; i < relations.length; i++)
            {
                relations[i].isMoving = false;
            }
        }
    }
}

//Handler for key pressing events.
function keyPressed(event)
{
    if(event.target === body)
    {
        let key = event.key;

        if(key === 'w')
        {
            movementDir.up = true;
        }
        if(key === 'a')
        {
            movementDir.left = true;
        }
        if(key === 's')
        {
            movementDir.down = true;
        }
        if(key === 'd')
        {
            movementDir.right = true;
        }
        if(event.shiftKey)
        {
            gridAligning = false;
        }
    }
}

//Handler for key releasing events.
function keyReleased(event)
{
    let key = event.key;
    movementDir.up = !(key === 'w') && movementDir.up;
    movementDir.down = !(key === 's') && movementDir.down;
    movementDir.left = !(key === 'a') && movementDir.left;
    movementDir.right = !(key === 'd') && movementDir.right;
    gridAligning = true;
}

function pageScrolled(event)
{
    let width = innerWidth / scale;
    let height = innerHeight / scale;

    scalelevel += event.deltaY * 0.001;
    scalelevel = Math.min(Math.max(scalelevel, ZOOM_DEPTH.MAXIMUM), ZOOM_DEPTH.MINIMUM);

    // console.log(scalelevel);

    scale = Math.pow(scalelevel + 1, -2);

    width -= innerWidth / scale;
    height -= innerHeight / scale;

    cameraX += width / 2;
    cameraY += height / 2;
}

function updateCamera()
{
    //Canvas is resized each frame to cover the whole screen.
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    //Filling the background with a white quad to avoid overdrawing.
    c.fillStyle = COLOR_PALETTE.BG;
    c.fillRect(0, 0, innerWidth, innerHeight);

    //Camera translation
    c.scale(scale, scale);
    c.translate(-cameraX, -cameraY);

    //Drawing the grid
    topLeftX = Math.floor(cameraX / gridSize) * gridSize;
    topLeftY = Math.floor(cameraY / gridSize) * gridSize;

    bottomRightX = Math.floor((cameraX + innerWidth / scale) / gridSize) * gridSize;
    bottomRightY = Math.floor((cameraY + innerHeight / scale) / gridSize) * gridSize;

    //Moving the camera.
    if(movementDir.up)
    {
        cameraY -= 5 / scale;
    }
    if(movementDir.down)
    {
        cameraY += 5 / scale;
    }
    if(movementDir.left)
    {
        cameraX -= 5 / scale;
    }
    if(movementDir.right)
    {
        cameraX += 5 / scale;
    }
}

function loop()
{
    requestAnimationFrame(loop);
    updateCamera();
    
    drawGrid();

    //Drawing and each relation.
    for(let i = 0; i < relations.length; i++)
    {
        relations[i].selected = (i === relationSelected);
        relations[i].draw(c);
    }
    //Drawing and updating each member.
    for(let i = 0; i < members.length; i++)
    {
        members[i].selected = (i === memberSelected);
        members[i].draw(c);
        members[i].update();
    }

    //Placing a member.
    if(placeMemberMode)
    {
        newMemberX = Math.floor((mouseX / scale + cameraX - 33) / gridSize) * gridSize;
        newMemberY = Math.floor((mouseY / scale + cameraY - 50) / gridSize) * gridSize;
        newMember.setPosition(newMemberX, newMemberY);
        newMember.draw(c);
    }

    c.translate(cameraX, cameraY);
    c.scale(1 / scale, 1 / scale);
}

//move to canvas utils?
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

addEventListener('mousedown', mousePressed);
addEventListener('mouseup', mouseReleased);
addEventListener('mousemove', mouseMoved);

addEventListener('keydown', keyPressed);
addEventListener('keyup', keyReleased);
addEventListener('wheel', pageScrolled);

memberForm.addEventListener('submit', handleForm);
newMemberButton.addEventListener('click', handleNewMember);
deleteMemberButton.addEventListener('click', handleDeleteMember);
newRelationButton.addEventListener('click', handleNewRelation);
loop();