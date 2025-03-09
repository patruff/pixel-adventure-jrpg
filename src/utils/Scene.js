import * as PIXI from 'pixi.js';

export class Scene extends PIXI.Container {
  constructor(app, params = {}) {
    super();
    
    this.app = app;
    this.params = params;
    
    // Initialize the scene
    this.init();
    
    // Start update loop
    this.app.ticker.add(this.update, this);
  }
  
  init() {
    // Override in child classes to initialize the scene
  }
  
  update(delta) {
    // Override in child classes to update the scene
  }
  
  destroy() {
    // Stop update loop
    this.app.ticker.remove(this.update, this);
    
    // Destroy all children
    super.destroy({ children: true });
  }
}

// Keyboard helper function
function keyboard(value) {
  const key = {
    value,
    isDown: false,
    isUp: true,
    press: null,
    release: null,
    downHandler: null,
    upHandler: null,
    unsubscribe: null,
  };
  
  // Downhandler
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };
  
  // Uphandler
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };
  
  // Add event listeners
  window.addEventListener('keydown', key.downHandler);
  window.addEventListener('keyup', key.upHandler);
  
  // Unsubscribe function
  key.unsubscribe = () => {
    window.removeEventListener('keydown', key.downHandler);
    window.removeEventListener('keyup', key.upHandler);
  };
  
  return key;
}