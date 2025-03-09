import * as PIXI from 'pixi.js';

export class CommandBox extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      width: 200,
      height: 150,
      padding: 8,
      background: 0x000066,
      backgroundAlpha: 0.8,
      borderColor: 0xFFFFFF,
      borderWidth: 2,
      borderRadius: 8,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 'white',
        wordWrap: true,
      },
      titleStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'white',
      },
      x: 60,
      y: 40,
    }, options);
    
    this.visible = false;
    this.init();
  }
  
  init() {
    // Create background
    this.background = new PIXI.Graphics();
    this.background.alpha = this.options.backgroundAlpha;
    this.addChild(this.background);
    
    // Create title text
    this.titleText = new PIXI.Text('COMMANDS', this.options.titleStyle);
    this.titleText.x = this.options.padding;
    this.titleText.y = this.options.padding;
    this.addChild(this.titleText);
    
    // Create commands text
    const textOptions = { ...this.options.textStyle };
    textOptions.wordWrapWidth = this.options.width - (this.options.padding * 2);
    
    this.commandsText = new PIXI.Text('', textOptions);
    this.commandsText.x = this.options.padding;
    this.commandsText.y = this.options.padding + 25;
    this.addChild(this.commandsText);
    
    // Redraw background
    this.redrawBackground();
    
    // Set position
    this.x = this.options.x;
    this.y = this.options.y;
  }
  
  redrawBackground() {
    this.background.clear();
    this.background.beginFill(this.options.background);
    this.background.lineStyle(this.options.borderWidth, this.options.borderColor);
    this.background.drawRoundedRect(
      0, 
      0, 
      this.options.width, 
      this.options.height, 
      this.options.borderRadius
    );
    this.background.endFill();
  }
  
  showCommands() {
    this.commandsText.text = 
      '- [ARROW KEYS]: Move character\n' +
      '- [SPACE]: Interact with objects/NPCs\n' +
      '- [V]: Talk to villagers\n' +
      '- [I]: View inventory\n' +
      '- [H]: View hero status (HP/Level)\n' +
      '- [E]: Equip items\n' +
      '- [ESC]: Exit current menu';
    
    this.visible = true;
  }
  
  hide() {
    this.visible = false;
  }
  
  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.showCommands();
    }
    
    // Ensure the box remains visible until explicitly hidden
    if (this.visible) {
      this.alpha = 1;
    }
  }
}