import * as PIXI from 'pixi.js';

export class StatusBox extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      width: 150,
      height: 100,
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
      },
      titleStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'white',
      },
      x: 85,
      y: 70,
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
    this.titleText = new PIXI.Text('HERO STATUS', this.options.titleStyle);
    this.titleText.x = this.options.padding;
    this.titleText.y = this.options.padding;
    this.addChild(this.titleText);
    
    // Create stats text
    this.statsText = new PIXI.Text('', this.options.textStyle);
    this.statsText.x = this.options.padding;
    this.statsText.y = this.options.padding + 25;
    this.addChild(this.statsText);
    
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
  
  show() {
    // Update stats text with current player stats
    this.statsText.text = 
      `HP: ${window.JRPG.gameState.playerHealth}/${window.JRPG.gameState.playerMaxHealth}\n` +
      `Level: ${window.JRPG.gameState.playerLevel}`;
    
    this.visible = true;
  }
  
  hide() {
    this.visible = false;
  }
  
  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
}