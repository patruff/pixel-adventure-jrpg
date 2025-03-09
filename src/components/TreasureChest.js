import * as PIXI from 'pixi.js';

export class TreasureChest extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      x: 0,
      y: 0,
      textureClosed: null,
      textureOpen: null,
      scale: 1,
      contents: null,
      onOpen: null,
    }, options);
    
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    // Set position
    this.x = this.options.x;
    this.y = this.options.y;
    
    // Create chest sprite
    if (this.options.textureClosed) {
      this.sprite = new PIXI.Sprite(this.options.textureClosed);
    } else {
      // Create a placeholder sprite
      this.sprite = new PIXI.Graphics();
      this.sprite.beginFill(0xA67D3D);
      this.sprite.lineStyle(1, 0x000000);
      this.sprite.drawRect(-8, -8, 16, 12);
      this.sprite.endFill();
      
      // Add lock
      this.sprite.beginFill(0xFFD700);
      this.sprite.drawRect(-2, -4, 4, 4);
      this.sprite.endFill();
    }
    
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(this.options.scale);
    this.addChild(this.sprite);
    
    // Make interactive
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.on('pointerdown', this.open.bind(this));
  }
  
  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    
    // Change texture
    if (this.options.textureOpen) {
      this.sprite.texture = this.options.textureOpen;
    } else {
      // Update placeholder sprite
      this.sprite.clear();
      this.sprite.beginFill(0xA67D3D);
      this.sprite.lineStyle(1, 0x000000);
      this.sprite.drawRect(-8, -8, 16, 12);
      this.sprite.endFill();
      
      // Add open lid
      this.sprite.beginFill(0x8B4513);
      this.sprite.drawRect(-8, -12, 16, 4);
      this.sprite.endFill();
      
      // Add treasure glow
      this.sprite.beginFill(0xFFD700, 0.5);
      this.sprite.drawRect(-4, -6, 8, 6);
      this.sprite.endFill();
    }
    
    // Call onOpen callback
    if (this.options.onOpen) {
      this.options.onOpen(this.options.contents);
    }
  }
}