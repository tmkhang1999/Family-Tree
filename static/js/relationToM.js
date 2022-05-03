class RelationToM
{
    TYPE = RELATION_TYPE.M_TO_M;
    selected = false;
    mode = "v";
    dotted = false;

    centerX = 0;
    centerY = 0;
    junction = 0.5;

    dotted = false;

    constructor(A, B)
    {
        this.MemAID = A;
        this.MemBID = B;
        this.id = Math.random();
        for (let i = 0; i < relations.length; i++) {
            if(this !== relations[i]){
                if(this.id === relations[i].id){
                    this.id = Math.random();
                    i = 0;
                }
            }
        }
    }

    draw(canvas)
    {
        let Ax = members[members.findIndex(object => { return object.id === this.MemAID;})].x;
        let Ay = members[members.findIndex(object => { return object.id === this.MemAID;})].y;
        let Bx = members[members.findIndex(object => { return object.id === this.MemBID;})].x;
        let By = members[members.findIndex(object => { return object.id === this.MemBID;})].y;

        this.centerX = (Ax + Bx) / 2;
        this.centerY = (Ay + By) / 2;

        switch(this.mode)
        {
            //Segmented line - vertical junction.
            case "v":

                if(Ax === Bx || Ay === By)
                {
                    if(this.selected) line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)),(gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                else
                {
                    let distX = (Bx - Ax) * this.junction;
                    if(this.selected)
                    {
                        line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)),(gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    }
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)), (gridSize / 2), this.dotted);
                    line(canvas, Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2), this.dotted);
                    line(canvas, Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                break;

            //Segmented line - horizontal junction.
            case "h":

                if(Ax === Bx || Ay === By)
                {
                    if(this.selected) line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)),(gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                else
                {
                    let distY = (By - Ay) * this.junction;
                    if(this.selected)
                    {
                        line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    }
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2), this.dotted);
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2), this.dotted);
                    line(canvas, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                break;
        }
    }

    isHovering(mouseX, mouseY)
    {
        let Ax = members[members.findIndex(object => { return object.id === this.MemAID;})].x;
        let Ay = members[members.findIndex(object => { return object.id === this.MemAID;})].y;
        let Bx = members[members.findIndex(object => { return object.id === this.MemBID;})].x;
        let By = members[members.findIndex(object => { return object.id === this.MemBID;})].y;

        const x = (mouseX / scale) + cameraX;
        const y = (mouseY / scale) + cameraY;

        const minX = Math.min(Ax, Bx);
        const maxX = Math.max(Ax, Bx);
        const minY = Math.min(Ay, By);
        const maxY = Math.max(Ay, By);

        let minXIsA = minX === Ax;
        let minYIsA = minY === Ay;

        switch(this.mode)
        {
            // case 0: //Straight line.
            //     //Vertical
            //     if(Ax === Bx)
            //         return pointOnVertical(x, y, minY + (gridSize * 3), maxY, Ax + gridSize, (gridSize / 4)); //Good
            //     //Horizontal
            //     else return pointOnHorizontal(x, y, minX + (gridSize * 2), maxX, Ay + (gridSize + (gridSize / 2)), (gridSize / 4)); //Good
            case "v": //Segmented line - vertical junction.
                return pointOnHorizontal(x, y, minX + (gridSize * 2), minX + (maxX - minX) * this.junction + gridSize, minXIsA ? Ay + (gridSize + (gridSize / 2)) : By + (gridSize + (gridSize / 2)), (gridSize / 4))
                || pointOnVertical(x, y, minY + (gridSize + (gridSize / 2)), maxY + (gridSize + (gridSize / 2)), minX + (maxX - minX) * this.junction + gridSize, (gridSize / 4))
                || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + gridSize, maxX, minXIsA ? By + (gridSize + (gridSize / 2)) : Ay + (gridSize + (gridSize / 2)), (gridSize / 4));
            case "h": //Segmented line - horizontal junction.
                return pointOnVertical(x, y, minY + (gridSize * 3), minY + (maxY - minY) * this.junction + (gridSize + (gridSize / 2)), minYIsA ? Ax + gridSize : Bx + gridSize, (gridSize / 4))
                || pointOnHorizontal(x, y, minX + gridSize, maxX + gridSize, minY + (maxY - minY) * this.junction + (gridSize + (gridSize / 2)), (gridSize / 4))
                || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + (gridSize + (gridSize / 2)), maxY, minYIsA ? Bx + gridSize : Ax + gridSize, (gridSize / 4));
        }
        return false;
    }

}