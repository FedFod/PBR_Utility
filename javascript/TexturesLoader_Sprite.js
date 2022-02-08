function Sprite(index, patcher, position, spriteSize, filename)
{
    this.p = patcher;
    this.filename = filename;
    this.index = index;

    this.position = position.slice();
    this.size = spriteSize.slice();
    this.borderSize = 2;

    this.textureType = null;

    // MATRIX //
    this.matrix = new JitterMatrix();
    this.matrix.importmovie(filename);

    // PWINDOW //
    this.pwindow = this.p.newdefault(this.position[0]+this.borderSize, this.position[1]+this.borderSize, "jit.pwindow");
    this.pwindow.varname = "pbl_pwindow_"+index;
    this.p.script("sendbox", this.pwindow.varname, "patching_rect", 
                  [this.position[0]+this.borderSize, this.position[1]+this.borderSize, this.size[0], this.size[1]]);
    this.pwindow.jit_matrix(this.matrix.name);

    // TEXTURE //
    this.texture = new JitterObject("jit.gl.texture", gGlobal.pworldName);
    this.texture.name = filename.replace(/\s/g, '')+gGlobal.patchID;
    this.texture.jit_matrix(this.matrix.name);

    // UMENU //
    // this.umenu =  


    if (this.filename.indexOf("diff") >= 0 || this.filename.indexOf("col") >= 0) 
    {
        gGlobal.textureNames.tex_diffuse = this.texture.name;
        this.textureType = "ALBEDO";
    }
    else if (this.filename.indexOf("AO") >= 0) 
    {
        gGlobal.textureNames.tex_ao = this.texture.name;
        this.textureType = "AO";
    }
    else if (this.filename.indexOf("bump") >= 0 || this.filename.indexOf("BUMP") >= 0) 
    {
        gGlobal.textureNames.tex_bump = this.texture.name;
        this.textureType = "BUMP";
    }
    else if (this.filename.indexOf("disp") >= 0 || this.filename.indexOf("DISP") >= 0 || this.filename.indexOf("height") >= 0) 
    {
        gGlobal.textureNames.tex_height = this.texture.name;
        this.textureType = "HEIGHT";
    }
    else if (this.filename.indexOf("NOR") >= 0 || this.filename.indexOf("nor") >= 0) 
    {
        gGlobal.textureNames.tex_normals = this.texture.name;
        this.textureType = "NORMALS";
    }
    else if (this.filename.indexOf("spec") >= 0 || this.filename.indexOf("SPEC") >= 0) 
    {
        gGlobal.textureNames.tex_specular = this.texture.name;
        this.textureType = "SPECULAR";
    }

    // PANEL //
    this.borderPanel = this.p.newdefault(this.position[0], this.position[1], "panel");
    this.borderPanel.varname = "bpl_borderPanel_"+index;
    this.borderPanel.border(this.borderSize);
    this.borderPanel.bgfillcolor(0,0,0,0);
    this.borderPanel.bordercolor(0,0,0,1);
    this.p.script("sendbox", this.borderPanel.varname, "patching_rect", 
                  [this.position[0], this.position[1], this.size[0]+this.borderSize*2, this.size[1]+this.borderSize*2]);
    this.p.script("bringtofront", this.borderPanel.varname);

    // BUTTON //
    this.button = this.p.newdefault(this.position[0]+this.borderSize, this.position[1]+this.borderSize, "ubutton");
    this.button.varname = "pbl_button_"+index;
    this.p.script("sendbox", this.button.varname, "patching_rect", 
                  [this.position[0]+this.borderSize, this.position[1]+this.borderSize, this.size[0], this.size[1]]);
    this.p.script("bringtofront", this.button.varname);

    this.button.filename = filename;

    var ButtonCallback = (function(data) { 
        // this.outlet.message("list", data.maxobject.filename);  
        outlet(0, "jit_gl_texture", this.texture.name);     
        }).bind(this); 

    this.buttonListener = new MaxobjListener(this.button, ButtonCallback);


    this.Resize = function(position, size)
    {
        this.size = size.slice();
        this.p.script("sendbox", this.pwindow.varname, "patching_rect", 
                  [position[0], position[1], this.size[0], this.size[1]]);
        this.p.script("sendbox", this.button.varname, "patching_rect", 
                  [position[0], position[1], this.size[0], this.size[1]]);
    
        this.pwindow.jit_matrix(this.matrix.name);
    }

    this.Destroy = function()
    {   
        print("cleaning sprite");
        this.p.remove(this.pwindow);
        this.p.remove(this.button);
        this.p.remove(this.borderPanel);
        // this.p.remove(this.outlet);
        // this.p.remove(this.receiver);
        this.matrix.freepeer();
        this.texture.freepeer();
    }
}