class RelationToM
{
    TYPE = RELATION_TYPE.M_TO_M;
    selected = false;
    modeModifier = 1;

    centerX = 0;
    centerY = 0;
    
    junction = 0.5;

    constructor(A, B)
    {
        this.indexMemA = A;
        this.indexMemB = B;
    }

    draw(canvas)
    {
        let Ax = members[this.indexMemA].x;
        let Ay = members[this.indexMemA].y;
        let Bx = members[this.indexMemB].x;
        let By = members[this.indexMemB].y;
        
        this.mode = 0;

        if(Ax !== Bx && Ay !== By)
        {
            this.mode = this.modeModifier % 2 + 1;
        }

        this.centerX = (Ax + Bx) / 2;
        this.centerY = (Ay + By) / 2;

        switch(this.mode)
        {
            //Straight line.
            case 0:
            if(this.selected) line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)),(gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2));
                break;
            //Segmented line - vertical junction.
            case 1:
                let distX = (Bx - Ax) * this.junction;
                if(this.selected)
                {
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)),(gridSize / 2) + (BorderSize * 2) , COLOR_PALETTE.SELECTED);
                    line(canvas, Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                    line(canvas, Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                }
                line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)), (gridSize / 2));
                line(canvas, Ax + distX + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2));
                line(canvas, Ax + distX + gridSize, By + (gridSize + (gridSize / 2)), Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2));
                break;
            //Segmented line - horizontal junction.
            case 2:
                let distY = (By - Ay) * this.junction;
                if(this.selected)
                {
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2) , COLOR_PALETTE.SELECTED);
                    line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2) , COLOR_PALETTE.SELECTED);
                    line(canvas, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2) + (BorderSize * 2) , COLOR_PALETTE.SELECTED);
                }
                line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)), Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2));
                line(canvas, Ax + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, (gridSize / 2));
                line(canvas, Bx + gridSize, Ay + (gridSize + (gridSize / 2)) + distY, Bx + gridSize, By + (gridSize + (gridSize / 2)), (gridSize / 2));
                break;
        }
    }

    isHovering(mouseX, mouseY)
    {
        let Ax = members[this.indexMemA].x;
        let Ay = members[this.indexMemA].y;
        let Bx = members[this.indexMemB].x;
        let By = members[this.indexMemB].y;

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
            case 0: //Straight line.
                //Vertical
                if(Ax === Bx)
                    return pointOnVertical(x, y, minY + (gridSize * 3), maxY, Ax + gridSize, (gridSize / 4)); //Good
                //Horizontal
                else return pointOnHorizontal(x, y, minX + (gridSize * 2), maxX, Ay + (gridSize + (gridSize / 2)), (gridSize / 4)); //Good
            case 1: //Segmented line - vertical junction.
                return pointOnHorizontal(x, y, minX + (gridSize * 2), minX + (maxX - minX) * this.junction + gridSize, minXIsA ? Ay + (gridSize + (gridSize / 2)) : By + (gridSize + (gridSize / 2)), (gridSize / 4))
                || pointOnVertical(x, y, minY + (gridSize + (gridSize / 2)), maxY + (gridSize + (gridSize / 2)), minX + (maxX - minX) * this.junction + gridSize, (gridSize / 4))
                || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + gridSize, maxX, minXIsA ? By + (gridSize + (gridSize / 2)) : Ay + (gridSize + (gridSize / 2)), (gridSize / 4));
            case 2: //Segmented line - horizontal junction.
                return pointOnVertical(x, y, minY + (gridSize * 3), minY + (maxY - minY) * this.junction + (gridSize + (gridSize / 2)), minYIsA ? Ax + gridSize : Bx + gridSize, (gridSize / 4))
                || pointOnHorizontal(x, y, minX + gridSize, maxX + gridSize, minY + (maxY - minY) * this.junction + (gridSize + (gridSize / 2)), (gridSize / 4))
                || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + (gridSize + (gridSize / 2)), maxY, minYIsA ? Bx + gridSize : Ax + gridSize, (gridSize / 4));
        }
        return false;
    }

    update()
    {

    }

}