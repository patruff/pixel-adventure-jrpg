import * as PIXI from 'pixi.js';

export class HelpBox extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      padding: 4,
      background: 0x000066,
      backgroundAlpha: 0.8,
      borderColor: 0xFFFFFF,
      borderWidth: 1,
      borderRadius: 4,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: 10,
        fill: 'white',
      },
    }, options);
    
    this.init();
  }
  
  init() {
    // Create the text
    this.helpText = new PIXI.Text('for commands, press c', this.options.textStyle);
    this.helpText.x = this.options.padding;
    this.helpText.y = this.options.padding;
    this.addChild(this.helpText);
    
    // Create the background
    this.background = new PIXI.Graphics();
    this.background.alpha = this.options.backgroundAlpha;
    this.background.beginFill(this.options.background);
    this.background.lineStyle(this.options.borderWidth, this.options.borderColor);
    this.background.drawRoundedRect(
      0, 
      0, 
      this.helpText.width + (this.options.padding * 2), 
      this.helpText.height + (this.options.padding * 2), 
      this.options.borderRadius
    );
    this.background.endFill();
    
    // Add background behind text
    this.addChildAt(this.background, 0);
    
    // Position in top right corner with small margin
    this.x = window.JRPG.constants.GAME_WIDTH - this.width - 10;
    this.y = 10;
  }
}