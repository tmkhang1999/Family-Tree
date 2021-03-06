class RelationToR
{
    TYPE = RELATION_TYPE.M_TO_R;
    selected = false;
    mode = "v";
    dotted = false;

    centerX = 0;
    centerY = 0;
    junction = 0.5;

    dotted = false;

    constructor(M, R)
    {
        this.MemID = M;
        this.RelID = R;
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
        const Mx = members[members.findIndex(object => { return object.id === this.MemID;})].x;
        const My = members[members.findIndex(object => { return object.id === this.MemID;})].y;
        const Rx = relations[relations.findIndex(object => { return object.id === this.RelID;})].centerX;
        const Ry = relations[relations.findIndex(object => { return object.id === this.RelID;})].centerY;

        this.centerX = (Mx + Rx) / 2;
        this.centerY = (My + Ry) / 2;

        switch(this.mode)
        {
            //Segmented line - vertical junction.
            case "v":

                if(Mx === Rx || My === Ry)
                {
                    if(this.selected) line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                else
                {
                   const distX = (Rx - Mx) * this.junction;
                    if(this.selected)
                    {
                        line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    }
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), (gridSize / 2), this.dotted);
                    line(canvas, Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2), this.dotted);
                    line(canvas, Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                break;
            //Segmented line - horizontal junction.
            case "h":

                if(Mx === Rx || My === Ry)
                {
                    if(this.selected) line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2), (gridSize / 2), this.dotted);
                }
                else
                {
                    const distY = (Ry - My) * this.junction;
                    if(this.selected)
                    {
                        line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                        line(canvas, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), this.dotted, COLOR_PALETTE.SELECTED);
                    }
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2), this.dotted);
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2), this.dotted);
                    line(canvas, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2), this.dotted);
                }
                break;
        }
    }

    isHovering(mouseX, mouseY)
    {
        const Mx = members[members.findIndex(object => { return object.id === this.MemID;})].x;
        const My = members[members.findIndex(object => { return object.id === this.MemID;})].y;
        const Rx = relations[relations.findIndex(object => { return object.id === this.RelID;})].centerX;
        const Ry = relations[relations.findIndex(object => { return object.id === this.RelID;})].centerY;
        
        const x = (mouseX / scale) + cameraX;
        const y = (mouseY / scale) + cameraY;

        const minX = Math.min(Mx, Rx);
        const maxX = Math.max(Mx, Rx);
        const minY = Math.min(My, Ry);
        const maxY = Math.max(My, Ry);

        const minXIsM = minX === Mx;
        const minYIsM = minY === My;

        switch(this.mode)
        {
            //Segmented line - vertical junction.
            case "v":
                return pointOnHorizontal(x, y, minX + (gridSize * 2), minX + (maxX - minX) * this.junction + gridSize, (minXIsM ? My: Ry) + (gridSize * 2 - (gridSize / 2)) , (gridSize / 4))
                    || pointOnVertical(x, y, minY + (gridSize * 2 - (gridSize / 2)), maxY + (gridSize * 2 - (gridSize / 2)), minX + (maxX - minX) * this.junction + gridSize, (gridSize / 4))
                    || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + gridSize, maxX, (minXIsM ? Ry  : My) + (gridSize * 2 - (gridSize / 2)), (gridSize / 4));
            //Segmented line - horizontal junction.
            case "h":
                return pointOnVertical(x, y, minY + (gridSize * 3), minY + (maxY - minY) * this.junction + (gridSize * 2 - (gridSize / 2)), (minYIsM ? Mx : Rx) + gridSize, (gridSize / 4))
                    || pointOnHorizontal(x, y, minX + gridSize, maxX + gridSize, minY + (maxY - minY) * this.junction + (gridSize * 2 - (gridSize / 2)), (gridSize / 4))
                    || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + (gridSize * 2 - (gridSize / 2)), maxY, (minYIsM ? Rx : Mx) + gridSize, (gridSize / 4));
        }
        return false;
    }

}