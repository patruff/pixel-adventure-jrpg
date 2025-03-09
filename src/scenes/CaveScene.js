import * as PIXI from 'pixi.js';
import { Scene } from '../utils/Scene';
import { Character } from '../components/Character';
import { DialogBox } from '../components/DialogBox';
import { TreasureChest } from '../components/TreasureChest';
import { WorldMapScene } from './WorldMapScene';
import { BattleScene } from './BattleScene';

export class CaveScene extends Scene {
  init() {
    // Create the scene elements
    this.createBackground();
    this.createPlayer();
    this.createTreasure();
    this.createBoss();
    this.createDialogBox();
    this.setupKeyboard();
    
    // Setup enemy encounter timer
    this.encounterTimer = 0;
    this.encounterChance = 0.01; // 1% chance per tick to encounter enemy
  }
  
  createBackground() {
    // Create a background for the cave
    this.background = new PIXI.Graphics();
    
    // Dark cave background
    this.background.beginFill(0x333333);
    this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
    this.background.endFill();
    
    // Create cave walls/obstacles
    this.walls = [];
    
    // Outer walls
    this.createWall(0, 0, window.JRPG.constants.GAME_WIDTH, 20); // Top
    this.createWall(0, window.JRPG.constants.GAME_HEIGHT - 20, window.JRPG.constants.GAME_WIDTH, 20); // Bottom
    this.createWall(0, 0, 20, window.JRPG.constants.GAME_HEIGHT); // Left
    this.createWall(window.JRPG.constants.GAME_WIDTH - 20, 0, 20, window.JRPG.constants.GAME_HEIGHT); // Right
    
    // Inner walls to create a maze-like structure
    this.createWall(60, 60, 100, 20);
    this.createWall(200, 60, 60, 20);
    this.createWall(60, 60, 20, 80);
    this.createWall(200, 120, 20, 60);
    this.createWall(60, 160, 120, 20);
    this.createWall(220, 160, 40, 20);
    
    // Exit marker (back to world map)
    this.exitMarker = new PIXI.Graphics();
    this.exitMarker.beginFill(0x696969);
    this.exitMarker.drawRect(-10, -5, 20, 10);
    this.exitMarker.endFill();
    
    this.exitMarker.x = window.JRPG.constants.GAME_WIDTH / 2;
    this.exitMarker.y = window.JRPG.constants.GAME_HEIGHT - 25;
    
    // Create exit collision zone
    this.exitZone = new PIXI.Rectangle(
      window.JRPG.constants.GAME_WIDTH / 2 - 10,
      window.JRPG.constants.GAME_HEIGHT - 30,
      20,
      15
    );
    
    this.addChild(this.background);
    this.addChild(this.exitMarker);
    
    // Add some decorative elements
    this.addDecorations();
  }
  
  createWall(x, y, width, height) {
    // Create a wall graphic
    const wall = new PIXI.Graphics();
    wall.beginFill(0x696969);
    wall.drawRect(0, 0, width, height);
    wall.endFill();
    
    wall.x = x;
    wall.y = y;
    
    this.addChild(wall);
    
    // Add wall to collision list
    this.walls.push(new PIXI.Rectangle(x, y, width, height));
  }
  
  addDecorations() {
    // Add some stalagmites/stalactites
    const decorPositions = [
      { x: 40, y: 40 },
      { x: 280, y: 40 },
      { x: 40, y: 200 },
      { x: 280, y: 200 },
      { x: 160, y: 120 }
    ];
    
    decorPositions.forEach(pos => {
      const decor = new PIXI.Graphics();
      
      // Either stalagmite (from ground) or stalactite (from ceiling)
      const isFromCeiling = Math.random() > 0.5;
      
      decor.beginFill(0x696969);
      if (isFromCeiling) {
        decor.drawPolygon([
          0, 0,
          6, 16,
          -6, 16
        ]);
      } else {
        decor.drawPolygon([
          0, 16,
          6, 0,
          -6, 0
        ]);
      }
      decor.endFill();
      
      decor.x = pos.x;
      decor.y = pos.y;
      
      this.addChild(decor);
    });
  }
  
  createPlayer() {
    // Create player character
    this.player = new Character({
      isPlayer: true,
      speed: 2
    });
    
    // Set initial position (at cave entrance)
    this.player.x = window.JRPG.constants.GAME_WIDTH / 2;
    this.player.y = window.JRPG.constants.GAME_HEIGHT - 40;
    
    this.addChild(this.player);
  }
  
  createTreasure() {
    // Create a treasure chest
    this.treasureChest = new TreasureChest({
      x: 50,
      y: 110,
      contents: {
        name: 'Magic Sword',
        type: 'weapon',
        power: 10
      },
      onOpen: (contents) => {
        this.dialogBox.setText([
          `You found a ${contents.name}!`,
          `Attack power increased by ${contents.power}!`
        ]);
        
        // Add item to inventory
        window.JRPG.gameState.inventory.push(contents);
      }
    });
    
    this.addChild(this.treasureChest);
  }
  
  createBoss() {
    // Create boss enemy
    this.boss = new Character({
      speed: 0
    });
    
    // Make boss larger and purple
    this.boss.sprite.clear();
    this.boss.sprite.beginFill(0x800080);
    this.boss.sprite.drawRect(-16, -16, 32, 32);
    this.boss.sprite.endFill();
    
    // Position boss in the center top area
    this.boss.x = window.JRPG.constants.GAME_WIDTH / 2;
    this.boss.y = 50;
    
    // Only add boss if we haven't defeated it yet
    if (window.JRPG.gameState.questProgress.mainQuest < 2) {
      this.addChild(this.boss);
    }
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
      if (this.dialogBox.visible) return;
      this.player.move(0, -1);
    };
    
    this.keys.up.release = () => {
      if (this.dialogBox.visible) return;
      if (!this.keys.down.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(0, 1);
      }
    };
    
    this.keys.down.press = () => {
      if (this.dialogBox.visible) return;
      this.player.move(0, 1);
    };
    
    this.keys.down.release = () => {
      if (this.dialogBox.visible) return;
      if (!this.keys.up.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(0, -1);
      }
    };
    
    this.keys.left.press = () => {
      if (this.dialogBox.visible) return;
      this.player.move(-1, 0);
    };
    
    this.keys.left.release = () => {
      if (this.dialogBox.visible) return;
      if (!this.keys.right.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(1, 0);
      }
    };
    
    this.keys.right.press = () => {
      if (this.dialogBox.visible) return;
      this.player.move(1, 0);
    };
    
    this.keys.right.release = () => {
      if (this.dialogBox.visible) return;
      if (!this.keys.left.isDown) {
        this.player.move(0, 0);
      } else {
        this.player.move(-1, 0);
      }
    };
    
    // Action key for interaction
    this.keys.action.press = () => {
      if (this.dialogBox.visible) {
        this.dialogBox.close();
        return;
      }
      this.checkInteractions();
    };
  }
  
  checkCollisions() {
    // Store current position to revert if collision occurs
    const prevX = this.player.x;
    const prevY = this.player.y;
    
    // Check wall collisions
    for (const wall of this.walls) {
      if (this.checkCollision(this.player, wall)) {
        // Revert position on collision
        this.player.x = prevX;
        this.player.y = prevY;
        break;
      }
    }
  }
  
  checkCollision(character, rectangle) {
    // Simple AABB collision check with character bounding box
    const charBounds = {
      x: character.x - 8,
      y: character.y - 8,
      width: 16,
      height: 16
    };
    
    return (
      charBounds.x < rectangle.x + rectangle.width &&
      charBounds.x + charBounds.width > rectangle.x &&
      charBounds.y < rectangle.y + rectangle.height &&
      charBounds.y + charBounds.height > rectangle.y
    );
  }
  
  checkInteractions() {
    // Check if player is near boss
    if (this.boss && this.boss.parent) {
      const distance = Math.sqrt(
        Math.pow(this.player.x - this.boss.x, 2) + 
        Math.pow(this.player.y - this.boss.y, 2)
      );
      
      if (distance < 40) {
        this.startBossBattle();
        return;
      }
    }
  }
  
  checkRandomEncounter(delta) {
    this.encounterTimer += delta;
    
    // Check for random encounter every second
    if (this.encounterTimer > 60) {
      this.encounterTimer = 0;
      
      if (Math.random() < this.encounterChance && this.player.moving) {
        this.startRandomBattle();
      }
    }
  }
  
  startRandomBattle() {
    window.JRPG.sceneManager.changeScene(BattleScene, {
      enemyType: 'cave',
      returnScene: CaveScene
    });
  }
  
  startBossBattle() {
    window.JRPG.sceneManager.changeScene(BattleScene, {
      enemyType: 'boss',
      returnScene: CaveScene,
      onVictory: () => {
        // Update quest progress
        window.JRPG.gameState.questProgress.mainQuest = 2;
        
        // Remove boss from cave when we return
        if (this.boss && this.boss.parent) {
          this.removeChild(this.boss);
        }
      }
    });
  }
  
  checkExits() {
    // Check if player is at the exit
    if (this.exitZone.contains(this.player.x, this.player.y)) {
      window.JRPG.sceneManager.changeScene(WorldMapScene);
    }
  }
  
  update(delta) {
    // Update player
    this.player.update(delta);
    
    // Check collisions
    this.checkCollisions();
    
    // Update dialog box
    this.dialogBox.update(delta);
    
    // Check for exits
    if (!this.dialogBox.visible) {
      this.checkExits();
    }
    
    // Check for random encounters if not in dialog
    if (!this.dialogBox.visible) {
      this.checkRandomEncounter(delta);
    }
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