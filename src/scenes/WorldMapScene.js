import * as PIXI from 'pixi.js';
import { Scene } from '../utils/Scene';
import { Character } from '../components/Character';
import { DialogBox } from '../components/DialogBox';
import { VillageScene } from './VillageScene';
import { CaveScene } from './CaveScene';
import { BattleScene } from './BattleScene';

export class WorldMapScene extends Scene {
  init() {
    // Create help and command boxes (specific to gameplay scenes)
    this.createHelpAndCommandBoxes();
    
    // Create the scene elements
    this.createBackground();
    this.createPlayer();
    this.createLocations();
    this.createDialogBox();
    this.createEnemies();
    this.setupKeyboard();
  }
  
  createBackground() {
    // Create a simple tilemap for the world
    this.background = new PIXI.Graphics();
    
    // Draw a green background for grass
    this.background.beginFill(0x7CFC00);
    this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
    this.background.endFill();
    
    // Draw a path from village to cave
    this.background.beginFill(0xDEB887);
    this.background.drawRect(
      window.JRPG.constants.GAME_WIDTH / 2 - 10, 
      0, 
      20, 
      window.JRPG.constants.GAME_HEIGHT
    );
    this.background.endFill();
    
    // Draw some mountains
    const mountainPositions = [
      { x: 30, y: 50 },
      { x: 60, y: 40 },
      { x: 90, y: 60 },
      { x: window.JRPG.constants.GAME_WIDTH - 30, y: 50 },
      { x: window.JRPG.constants.GAME_WIDTH - 60, y: 40 },
      { x: window.JRPG.constants.GAME_WIDTH - 90, y: 60 }
    ];
    
    mountainPositions.forEach(pos => {
      this.background.beginFill(0x808080);
      this.background.drawPolygon([
        pos.x - 15, pos.y + 10,
        pos.x, pos.y - 15,
        pos.x + 15, pos.y + 10
      ]);
      this.background.endFill();
    });
    
    // Draw some trees
    const treePositions = [
      { x: 40, y: 120 },
      { x: 70, y: 160 },
      { x: 30, y: 200 },
      { x: window.JRPG.constants.GAME_WIDTH - 40, y: 120 },
      { x: window.JRPG.constants.GAME_WIDTH - 70, y: 160 },
      { x: window.JRPG.constants.GAME_WIDTH - 30, y: 200 }
    ];
    
    treePositions.forEach(pos => {
      // Tree trunk
      this.background.beginFill(0x8B4513);
      this.background.drawRect(pos.x - 2, pos.y, 4, 8);
      this.background.endFill();
      
      // Tree leaves
      this.background.beginFill(0x006400);
      this.background.drawCircle(pos.x, pos.y - 6, 8);
      this.background.endFill();
    });
    
    // Add a small lake
    this.background.beginFill(0x1E90FF);
    this.background.drawEllipse(
      window.JRPG.constants.GAME_WIDTH / 4, 
      window.JRPG.constants.GAME_HEIGHT / 3 * 2, 
      30, 
      20
    );
    this.background.endFill();
    
    this.addChild(this.background);
  }
  
  createPlayer() {
    // Create player character
    this.player = new Character({
      isPlayer: true,
      speed: 2
    });
    
    // Set initial position (bottom of the map if coming from village)
    this.player.x = window.JRPG.constants.GAME_WIDTH / 2;
    this.player.y = window.JRPG.constants.GAME_HEIGHT - 20;
    
    this.addChild(this.player);
  }
  
  createLocations() {
    // Create location markers for village and cave
    this.locations = new PIXI.Container();
    
    // Village marker (bottom of map)
    this.villageMarker = new PIXI.Graphics();
    this.villageMarker.beginFill(0xCD853F);
    this.villageMarker.drawRect(-10, -8, 20, 16);
    this.villageMarker.endFill();
    
    // Village roof
    this.villageMarker.beginFill(0x8B4513);
    this.villageMarker.drawPolygon([
      -12, -8,
      12, -8,
      0, -18
    ]);
    this.villageMarker.endFill();
    
    this.villageMarker.x = window.JRPG.constants.GAME_WIDTH / 2;
    this.villageMarker.y = window.JRPG.constants.GAME_HEIGHT - 10;
    
    // Create village collision zone
    this.villageZone = new PIXI.Rectangle(
      window.JRPG.constants.GAME_WIDTH / 2 - 15,
      window.JRPG.constants.GAME_HEIGHT - 20,
      30,
      20
    );
    
    // Cave marker (top of map)
    this.caveMarker = new PIXI.Graphics();
    this.caveMarker.beginFill(0x696969);
    this.caveMarker.drawRect(-20, -15, 40, 30);
    this.caveMarker.endFill();
    
    // Cave entrance
    this.caveMarker.beginFill(0x000000);
    this.caveMarker.drawRect(-8, -5, 16, 20);
    this.caveMarker.endFill();
    
    this.caveMarker.x = window.JRPG.constants.GAME_WIDTH / 2;
    this.caveMarker.y = 15;
    
    // Create cave collision zone
    this.caveZone = new PIXI.Rectangle(
      window.JRPG.constants.GAME_WIDTH / 2 - 15,
      0,
      30,
      20
    );
    
    // Add markers to the scene
    this.locations.addChild(this.villageMarker);
    this.locations.addChild(this.caveMarker);
    this.addChild(this.locations);
  }
  
  createDialogBox() {
    this.dialogBox = new DialogBox({
      width: window.JRPG.constants.GAME_WIDTH - 40,
      height: 80,
      x: 20,
      y: window.JRPG.constants.GAME_HEIGHT - 100
    });
    
    this.dialogBox.x = 20;
    this.dialogBox.y = window.JRPG.constants.GAME_HEIGHT - 100;
    
    this.addChild(this.dialogBox);
  }
  
  createEnemies() {
    // Create random enemies that wander the map
    this.enemies = [];
    
    const enemyPositions = [
      { x: window.JRPG.constants.GAME_WIDTH / 4, y: window.JRPG.constants.GAME_HEIGHT / 3 },
      { x: window.JRPG.constants.GAME_WIDTH / 4 * 3, y: window.JRPG.constants.GAME_HEIGHT / 3 },
      { x: window.JRPG.constants.GAME_WIDTH / 2, y: window.JRPG.constants.GAME_HEIGHT / 2 }
    ];
    
    enemyPositions.forEach((pos, index) => {
      const enemy = new Character({
        speed: 0.5
      });
      
      // Make enemies red
      enemy.sprite.clear();
      enemy.sprite.beginFill(0xFF0000);
      enemy.sprite.drawRect(-8, -8, 16, 16);
      enemy.sprite.endFill();
      
      enemy.x = pos.x;
      enemy.y = pos.y;
      
      // Add random movement
      enemy.moveTimer = 0;
      enemy.moveDirection = { x: 0, y: 0 };
      
      this.enemies.push(enemy);
      this.addChild(enemy);
    });
  }
  
  setupKeyboard() {
    // Setup keyboard for player movement
    this.keys = {
      up: keyboard('ArrowUp'),
      down: keyboard('ArrowDown'),
      left: keyboard('ArrowLeft'),
      right: keyboard('ArrowRight'),
      action: keyboard(' ')
    };
    
    // Key press handlers
    this.keys.up.press = () => {
      if (this.anyMenuVisible()) return;
      this.player.move(0, -1);
    };
    
    this.keys.up.release = () => {
      if (this.anyMenuVisible()) return;
      if (!this.keys.down.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(0, 1);
      }
    };
    
    this.keys.down.press = () => {
      if (this.anyMenuVisible()) return;
      this.player.move(0, 1);
    };
    
    this.keys.down.release = () => {
      if (this.anyMenuVisible()) return;
      if (!this.keys.up.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(0, -1);
      }
    };
    
    this.keys.left.press = () => {
      if (this.anyMenuVisible()) return;
      this.player.move(-1, 0);
    };
    
    this.keys.left.release = () => {
      if (this.anyMenuVisible()) return;
      if (!this.keys.right.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(1, 0);
      }
    };
    
    this.keys.right.press = () => {
      if (this.anyMenuVisible()) return;
      this.player.move(1, 0);
    };
    
    this.keys.right.release = () => {
      if (this.anyMenuVisible()) return;
      if (!this.keys.left.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(-1, 0);
      }
    };
    
    // Action key for closing menus
    this.keys.action.press = () => {
      if (this.anyMenuVisible()) {
        this.hideAllMenus();
      }
    };
  }
  
  updateEnemies(delta) {
    this.enemies.forEach(enemy => {
      // Update enemy position
      enemy.update(delta);
      
      // Random movement
      enemy.moveTimer += delta;
      if (enemy.moveTimer > 120) {
        enemy.moveTimer = 0;
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        enemy.moveDirection.x = Math.cos(angle);
        enemy.moveDirection.y = Math.sin(angle);
        
        // Sometimes stop moving
        if (Math.random() < 0.3) {
          enemy.moveDirection.x = 0;
          enemy.moveDirection.y = 0;
        }
        
        enemy.move(enemy.moveDirection.x, enemy.moveDirection.y);
      }
      
      // Keep enemies within bounds
      enemy.x = Math.max(20, Math.min(window.JRPG.constants.GAME_WIDTH - 20, enemy.x));
      enemy.y = Math.max(20, Math.min(window.JRPG.constants.GAME_HEIGHT - 20, enemy.y));
      
      // Check for collision with player (random encounters)
      const distance = Math.sqrt(
        Math.pow(this.player.x - enemy.x, 2) + 
        Math.pow(this.player.y - enemy.y, 2)
      );
      
      if (distance < 20 && !this.dialogBox.visible) {
        this.startBattle(enemy);
      }
    });
  }
  
  startBattle(enemy) {
    // Remove this enemy from the map
    this.removeChild(enemy);
    this.enemies = this.enemies.filter(e => e !== enemy);
    
    // Start battle scene
    window.JRPG.sceneManager.changeScene(BattleScene, {
      enemyType: 'slime',
      returnScene: WorldMapScene
    });
  }
  
  checkLocations() {
    // Check if player is at the village
    if (this.villageZone.contains(this.player.x, this.player.y)) {
      window.JRPG.sceneManager.changeScene(VillageScene, { isInterior: false });
    }
    
    // Check if player is at the cave
    if (this.caveZone.contains(this.player.x, this.player.y)) {
      window.JRPG.sceneManager.changeScene(CaveScene);
    }
  }
  
  anyMenuVisible() {
    return (
      this.dialogBox.visible || 
      (this.commandBox && this.commandBox.visible)
    );
  }
  
  hideAllMenus() {
    this.dialogBox.close();
    if (this.commandBox) this.commandBox.hide();
  }
  
  update(delta) {
    // Update player
    this.player.update(delta);
    
    // Update enemies
    this.updateEnemies(delta);
    
    // Update dialog box
    this.dialogBox.update(delta);
    
    // Check for locations
    if (!this.anyMenuVisible()) {
      this.checkLocations();
    }
    
    // Simple boundary collision
    this.player.x = Math.max(10, Math.min(window.JRPG.constants.GAME_WIDTH - 10, this.player.x));
    this.player.y = Math.max(10, Math.min(window.JRPG.constants.GAME_HEIGHT - 10, this.player.y));
  }
  
  destroy() {
    // Clean up keyboard listeners
    for (const key of Object.values(this.keys)) {
      key.unsubscribe();
    }
    
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