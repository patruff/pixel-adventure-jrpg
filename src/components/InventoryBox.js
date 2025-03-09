import * as PIXI from 'pixi.js';

export class InventoryBox extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      width: 180,
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
      },
      titleStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'bold',
        fill: 'white',
      },
      x: 70,
      y: 45,
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
    this.titleText = new PIXI.Text('INVENTORY', this.options.titleStyle);
    this.titleText.x = this.options.padding;
    this.titleText.y = this.options.padding;
    this.addChild(this.titleText);
    
    // Create inventory text
    this.inventoryText = new PIXI.Text('', this.options.textStyle);
    this.inventoryText.x = this.options.padding;
    this.inventoryText.y = this.options.padding + 25;
    this.addChild(this.inventoryText);
    
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
    // Update inventory text with current inventory
    const inventory = window.JRPG.gameState.inventory;
    
    if (inventory.length === 0) {
      this.inventoryText.text = 'Your inventory is empty.';
    } else {
      this.inventoryText.text = inventory.map(item => `- ${item.name}`).join('\n');
    }
    
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