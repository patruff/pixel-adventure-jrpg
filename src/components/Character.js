import * as PIXI from 'pixi.js';

export class Character extends PIXI.Container {
  constructor(options = {}) {
    super();
    
    this.options = Object.assign({
      texture: null,
      speed: 1,
      scale: 1,
      isPlayer: false,
      animations: {},
      frameWidth: 16,
      frameHeight: 16,
    }, options);
    
    this.vx = 0;
    this.vy = 0;
    this.direction = 'down';
    this.moving = false;
    this.currentAnimation = null;
    this.animationSpeed = 0.1;
    this.frames = 0;
    
    this.init();
  }
  
  init() {
    // If a texture is provided, create a sprite
    if (this.options.texture) {
      this.sprite = new PIXI.Sprite(this.options.texture);
      this.sprite.anchor.set(0.5);
      this.addChild(this.sprite);
    } else {
      // Create a placeholder sprite
      this.sprite = new PIXI.Graphics();
      this.sprite.beginFill(this.options.isPlayer ? 0x3333FF : 0xFF3333);
      this.sprite.drawRect(-8, -8, 16, 16);
      this.sprite.endFill();
      this.addChild(this.sprite);
    }
    
    // Set scale
    this.scale.set(this.options.scale);
  }
  
  move(dx, dy) {
    this.vx = dx * this.options.speed;
    this.vy = dy * this.options.speed;
    
    // Set direction based on movement
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 'right' : 'left';
    } else {
      this.direction = dy > 0 ? 'down' : 'up';
    }
    
    this.moving = dx !== 0 || dy !== 0;
    
    // Update animation
    this.updateAnimation();
  }
  
  updateAnimation() {
    // If we have animations defined
    if (Object.keys(this.options.animations).length > 0) {
      // Determine which animation to play
      let animName = this.moving ? `walk_${this.direction}` : `idle_${this.direction}`;
      
      // If animation exists for this state
      if (this.options.animations[animName]) {
        // If different from current animation, change animation
        if (this.currentAnimation !== animName) {
          this.currentAnimation = animName;
          this.frames = 0;
          
          // Update texture
          const frameIndex = 0;
          const frame = this.options.animations[animName][frameIndex];
          this.sprite.texture = frame;
        }
      }
    }
  }
  
  update(delta) {
    // Update position
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    
    // Update animation if character is moving
    if (this.moving && Object.keys(this.options.animations).length > 0) {
      this.frames += this.animationSpeed * delta;
      
      if (this.frames >= 1) {
        const animation = this.options.animations[this.currentAnimation];
        const frameIndex = Math.floor(this.frames) % animation.length;
        const frame = animation[frameIndex];
        
        this.sprite.texture = frame;
        
        // Keep fractional part of frames
        this.frames = this.frames % 1;
      }
    }
  }
}