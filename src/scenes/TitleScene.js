import * as PIXI from 'pixi.js';
import { Scene } from '../utils/Scene';
import { VillageScene } from './VillageScene';

export class TitleScene extends Scene {
  init() {
    // Background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000033);
    this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
    this.background.endFill();
    this.addChild(this.background);
    
    // Title text
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
      stroke: '#4a1850',
      strokeThickness: 4,
    });
    
    const title = new PIXI.Text('PIXEL ADVENTURE', titleStyle);
    title.anchor.set(0.5);
    title.x = window.JRPG.constants.GAME_WIDTH / 2;
    title.y = window.JRPG.constants.GAME_HEIGHT / 3;
    this.addChild(title);
    
    // Start game text
    const startStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 'white',
    });
    
    const startText = new PIXI.Text('Press ENTER to start', startStyle);
    startText.anchor.set(0.5);
    startText.x = window.JRPG.constants.GAME_WIDTH / 2;
    startText.y = window.JRPG.constants.GAME_HEIGHT * 2 / 3;
    this.addChild(startText);
    
    // Blinking effect for start text
    this.blinkTime = 0;
    
    // Add keyboard listener
    this.keyEnter = keyboard('Enter');
    this.keyEnter.press = () => {
      window.JRPG.sceneManager.changeScene(VillageScene, { isInterior: true });
    };
  }
  
  update(delta) {
    // Make start text blink
    this.blinkTime += delta;
    if (this.blinkTime > 60) {
      this.blinkTime = 0;
      this.getChildAt(2).visible = !this.getChildAt(2).visible;
    }
  }
  
  destroy() {
    // Remove keyboard listener
    this.keyEnter.unsubscribe();
    
    super.destroy();
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