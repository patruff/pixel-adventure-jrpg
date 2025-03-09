import * as PIXI from 'pixi.js';
import { HelpBox } from '../components/HelpBox';
import { CommandBox } from '../components/CommandBox';

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
  
  // Method to be called by gameplay scenes, but not title screen
  createHelpAndCommandBoxes() {
    // Create help box
    this.helpBox = new HelpBox();
    this.addChild(this.helpBox);
    
    // Create command box
    this.commandBox = new CommandBox({
      x: (window.JRPG.constants.GAME_WIDTH - 200) / 2,
      y: (window.JRPG.constants.GAME_HEIGHT - 150) / 2
    });
    this.addChild(this.commandBox);
    
    // Setup keyboard for command box
    this.setupCommandKeyboard();
  }
  
  setupCommandKeyboard() {
    // Keyboard input for commands
    this.keyCommand = keyboard('c');
    this.keyCommand.press = () => {
      this.commandBox.toggle();
    };
    
    // Close command box with escape
    this.keyEscape = keyboard('Escape');
    this.keyEscape.press = () => {
      if (this.commandBox && this.commandBox.visible) {
        this.commandBox.hide();
      }
    };
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
    
    // Clean up keyboard listeners if they exist
    if (this.keyCommand) this.keyCommand.unsubscribe();
    if (this.keyEscape) this.keyEscape.unsubscribe();
    
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