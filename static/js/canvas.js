//Camera Related Variables
let cameraX = 0;
let cameraY = 0;
let scale = 1;
let scalelevel = 0;

//Selection Variables
let relationSelected = -1;
let memberSelected = -1;
let prevMemberSelected = -1;
//Modes
let placeMemberMode = false;
let placeRelationMode = false;

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

let newMember = null;
const members = [];
const relations = [];


function mousePressed(event)
{
    if(event.target === canvas)
    {
        memberForm.style.display = "none";
        let x = event.clientX;
        let y = event.clientY;
        memberSelected = -1;
        relationSelected = -1;
        memberForm.reset();


        if (event.button === 0) {
            for (let i = 0; i < members.length; i++) {
                if (members[i].isHovering(x, y)) {
                    members[i].isMoving = true;
                    memberSelected = i;
                    fillForm();
                    if(placeRelationMode)
                    {
                        relations.push(new RelationToM(prevMemberSelected, memberSelected));
                        placeRelationMode = false;
                    }
                }
            }
            for (let i = 0; i < relations.length; i++) {
                if (relations[i].isHovering(x, y)) {
                    relationSelected = i;
                    if(placeRelationMode)
                    {
                        relations.push(new RelationToR(prevMemberSelected, relationSelected));
                        placeRelationMode = false;
                    }
                }
            }
        }

        if (event.button === 0 && placeMemberMode && newMember != null) {
            newMember.setPosition(newMemberX, newMemberY);
            members.push(newMember);
            newMember = null;
            placeMemberMode = false;
        }

        placeRelationMode = false;
    }
}

function mouseMoved(event)
{
    if(event.target === canvas)
    {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
}

function mouseReleased(event)
{
    if(event.target === canvas)
    {
        if (event.button === 0) {
            for (let i = 0; i < members.length; i++) {
                members[i].isMoving = false;
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

        if (key === 'w') {
            movementDir.up = true;
        }
        if (key === 'a') {
            movementDir.left = true;
        }
        if (key === 's') {
            movementDir.down = true;
        }
        if (key === 'd') {
            movementDir.right = true;
        }
        if (key === ',' && relationSelected !== -1) {
            if (relations[relationSelected].modeModifier === 0) relations[relationSelected].modeModifier = 1;
            else if (relations[relationSelected].modeModifier === 1) relations[relationSelected].modeModifier = 0;
        }
        if (key === "Delete" || key === "Backspace") {
            if (memberSelected !== -1) {
                for (let i = 0; i < relations.length; i++) {
                    if (relations[i].indexMemA === memberSelected || relations[i].indexMemB === memberSelected || relations[i].indexMem === memberSelected) {
                        relations.splice(i, 1);
                    }
                }
                members.splice(memberSelected, 1);
                memberSelected = -1;
            }
            if (relationSelected !== -1) {
                relations.splice(relationSelected, 1);
                relationSelected = -1;
            }
        }
        if (event.shiftKey) {
            gridAligning = false;
        }
    }
}

//Handler for key releasing events.
function keyReleased(event)
{
    if(event.target === body)
    {
        let key = event.key;
        movementDir.up = !(key === 'w') && movementDir.up;
        movementDir.down = !(key === 's') && movementDir.down;
        movementDir.left = !(key === 'a') && movementDir.left;
        movementDir.right = !(key === 'd') && movementDir.right;

        gridAligning = true;
    }
}

function pageScrolled(event)
{
    if(event.target === canvas)
    {
        let width = innerWidth / scale;
        let height = innerHeight / scale;

        scalelevel += event.deltaY * 0.001;
        scalelevel = Math.min(Math.max(scalelevel, ZOOM_DEPTH.MINIMUM), ZOOM_DEPTH.MAXIMUM);

        scale = Math.pow(scalelevel + 1, -2);

        width -= innerWidth / scale;
        height -= innerHeight / scale;

        cameraX += width / 2;
        cameraY += height / 2;
    }
}

function updateCamera()
{
    //Canvas is resized each frame to cover the whole screen.
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    //Filling the background with a white quad to avoid overdrawing.
    c.fillStyle = '#ffffff';
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


    if(placeRelationMode)
    {
        line(c, members[prevMemberSelected].x + gridSize, members[prevMemberSelected].y + (gridSize + (gridSize / 2)), (mouseX / scale) + cameraX, (mouseY / scale) + cameraY, gridSize / 2, "#999999");
    }

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
        members[i].update();
        members[i].draw(c);
    }

    if(placeMemberMode)
    {
        newMemberX = Math.floor((mouseX / scale + cameraX - (2 * gridSize / 3)) / gridSize) * gridSize;
        newMemberY = Math.floor((mouseY / scale + cameraY - gridSize) / gridSize) * gridSize;
        newMember.setPosition(newMemberX, newMemberY);
        newMember.draw(c);
    }

    c.translate(cameraX, cameraY);
    c.scale(1 / scale, 1 / scale);
}

addEventListener('mousedown', mousePressed);
addEventListener('mouseup', mouseReleased);
addEventListener('mousemove', mouseMoved);

addEventListener('keydown', keyPressed);
addEventListener('keyup', keyReleased);
addEventListener('wheel', pageScrolled);

memberForm.addEventListener('submit', handleForm);
newMemberButton.addEventListener('click', handleNewMember);
newRelationButton.addEventListener('click', handleNewRelation);
deleteMemberButton.addEventListener('click', handleDeleteMember);
loop();