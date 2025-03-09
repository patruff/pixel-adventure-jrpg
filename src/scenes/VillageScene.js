import * as PIXI from 'pixi.js';
import { Scene } from '../utils/Scene';
import { Character } from '../components/Character';
import { DialogBox } from '../components/DialogBox';
import { WorldMapScene } from './WorldMapScene';

export class VillageScene extends Scene {
  init() {
    // Scene properties
    this.isInterior = this.params.isInterior || false;
    
    // Create the scene
    this.createBackground();
    this.createPlayer();
    this.createNPCs();
    this.createDialogBox();
    this.setupKeyboard();
    
    // If interior, show initial dialog
    if (this.isInterior && window.JRPG.gameState.questProgress.mainQuest === 0) {
      this.showInitialDialog();
    }
    
    // Add sword to inventory if first quest completed
    if (window.JRPG.gameState.questProgress.mainQuest === 1 && window.JRPG.gameState.inventory.length === 0) {
      window.JRPG.gameState.inventory.push({
        name: "Wooden Sword",
        type: "weapon",
        attack: 5
      });
    }
  }
  
  createBackground() {
    // Create a placeholder background
    this.background = new PIXI.Graphics();
    
    if (this.isInterior) {
      // House interior
      this.background.beginFill(0x8B4513);
      this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
      this.background.endFill();
      
      // Floor
      this.background.beginFill(0xCD853F);
      this.background.drawRect(20, 20, window.JRPG.constants.GAME_WIDTH - 40, window.JRPG.constants.GAME_HEIGHT - 40);
      this.background.endFill();
      
      // Furniture (table)
      this.background.beginFill(0x8B4513);
      this.background.drawRect(window.JRPG.constants.GAME_WIDTH / 2 - 15, 40, 30, 30);
      this.background.endFill();
      
      // Door
      this.background.beginFill(0x8B4513);
      this.background.drawRect(window.JRPG.constants.GAME_WIDTH / 2 - 10, window.JRPG.constants.GAME_HEIGHT - 22, 20, 20);
      this.background.endFill();
      
      // Door handle
      this.background.beginFill(0xFFD700);
      this.background.drawCircle(window.JRPG.constants.GAME_WIDTH / 2 + 5, window.JRPG.constants.GAME_HEIGHT - 12, 2);
      this.background.endFill();
      
      // Exit zone
      this.exitZone = new PIXI.Rectangle(
        window.JRPG.constants.GAME_WIDTH / 2 - 15,
        window.JRPG.constants.GAME_HEIGHT - 25,
        30,
        25
      );
    } else {
      // Village exterior
      this.background.beginFill(0x7CFC00);
      this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
      this.background.endFill();
      
      // Houses (3 simple houses)
      const housePositions = [
        { x: 40, y: 40 },
        { x: window.JRPG.constants.GAME_WIDTH - 80, y: 40 },
        { x: window.JRPG.constants.GAME_WIDTH / 2, y: 40 }
      ];
      
      housePositions.forEach(pos => {
        // House body
        this.background.beginFill(0xCD853F);
        this.background.drawRect(pos.x - 20, pos.y, 40, 30);
        this.background.endFill();
        
        // House roof
        this.background.beginFill(0x8B4513);
        this.background.drawPolygon([
          pos.x - 25, pos.y,
          pos.x + 25, pos.y,
          pos.x, pos.y - 20
        ]);
        this.background.endFill();
        
        // House door
        this.background.beginFill(0x8B4513);
        this.background.drawRect(pos.x - 5, pos.y + 15, 10, 15);
        this.background.endFill();
      });
      
      // Path to world map (bottom of screen)
      this.background.beginFill(0xDEB887);
      this.background.drawRect(window.JRPG.constants.GAME_WIDTH / 2 - 20, window.JRPG.constants.GAME_HEIGHT - 30, 40, 30);
      this.background.endFill();
      
      // Exit zone to world map
      this.exitZone = new PIXI.Rectangle(
        window.JRPG.constants.GAME_WIDTH / 2 - 20,
        window.JRPG.constants.GAME_HEIGHT - 30,
        40,
        30
      );
      
      // Player house entrance
      this.houseEntrance = new PIXI.Rectangle(
        window.JRPG.constants.GAME_WIDTH / 2 - 5,
        55,
        10,
        15
      );
    }
    
    this.addChild(this.background);
  }
  
  createPlayer() {
    // Create player character
    this.player = new Character({
      isPlayer: true,
      speed: 2
    });
    
    // Set initial position
    if (this.isInterior) {
      this.player.x = window.JRPG.constants.GAME_WIDTH / 2;
      this.player.y = window.JRPG.constants.GAME_HEIGHT / 2;
    } else {
      this.player.x = window.JRPG.constants.GAME_WIDTH / 2;
      this.player.y = 100;
    }
    
    this.addChild(this.player);
  }
  
  createNPCs() {
    this.npcs = [];
    
    if (this.isInterior && window.JRPG.gameState.questProgress.mainQuest === 0) {
      // Create the Old Sage NPC in the house
      const sage = new Character({
        speed: 0.5
      });
      
      // Make the sage look old using a white-colored placeholder
      sage.sprite.clear();
      sage.sprite.beginFill(0xDCDCDC);
      sage.sprite.drawRect(-8, -8, 16, 16);
      sage.sprite.endFill();
      
      sage.x = window.JRPG.constants.GAME_WIDTH / 2;
      sage.y = 80;
      
      this.npcs.push(sage);
      this.addChild(sage);
    } else if (!this.isInterior) {
      // Add some villagers to the exterior scene
      const villagerPositions = [
        { x: 100, y: 150 },
        { x: window.JRPG.constants.GAME_WIDTH - 100, y: 120 },
        { x: window.JRPG.constants.GAME_WIDTH / 2 - 50, y: 180 }
      ];
      
      const villagerColors = [0xFF9999, 0x99FF99, 0x9999FF];
      
      villagerPositions.forEach((pos, index) => {
        const villager = new Character({
          speed: 0.5
        });
        
        // Give each villager a different color
        villager.sprite.clear();
        villager.sprite.beginFill(villagerColors[index]);
        villager.sprite.drawRect(-8, -8, 16, 16);
        villager.sprite.endFill();
        
        villager.x = pos.x;
        villager.y = pos.y;
        
        this.npcs.push(villager);
        this.addChild(villager);
      });
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
      action: keyboard(' '),
      talkToVillager: keyboard('v')
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
    
    // Talk to villager key
    this.keys.talkToVillager.press = () => {
      if (this.dialogBox.visible) {
        this.dialogBox.close();
        return;
      }
      this.findAndTalkToNearestVillager();
    };
  }
  
  findAndTalkToNearestVillager() {
    // Find the nearest NPC
    let nearestNPC = null;
    let shortestDistance = Infinity;
    
    for (const npc of this.npcs) {
      const distance = Math.sqrt(
        Math.pow(this.player.x - npc.x, 2) + 
        Math.pow(this.player.y - npc.y, 2)
      );
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestNPC = npc;
      }
    }
    
    // Talk to nearest NPC if within range
    if (nearestNPC && shortestDistance < 50) {
      this.showDialogBasedOnQuestProgress();
    } else {
      this.dialogBox.setText([
        "There's no one close enough to talk to."
      ]);
    }
  }
  
  showInitialDialog() {
    // Show the Old Sage's initial dialog
    this.dialogBox.setText([
      "Welcome, young hero. Our village is in need of your help.",
      "A dark force has taken residence in the cave to the east.",
      "You must go there and defeat the evil that lurks within.",
      "Take this sword and begin your journey!"
    ], "Old Sage");
    
    this.dialogBox.options.onComplete = () => {
      // Update quest progress
      window.JRPG.gameState.questProgress.mainQuest = 1;
    };
  }
  
  showDialogBasedOnQuestProgress() {
    // Show dialog based on current quest progress
    if (window.JRPG.gameState.questProgress.mainQuest === 0) {
      this.showInitialDialog();
    } else if (window.JRPG.gameState.questProgress.mainQuest === 1) {
      this.dialogBox.setText([
        "You must hurry to the cave and defeat the evil that lurks there!",
        "Our village is counting on you, brave hero."
      ], "Villager");
    } else if (window.JRPG.gameState.questProgress.mainQuest === 2) {
      this.dialogBox.setText([
        "You've defeated the evil! You're our hero!",
        "The village will forever be in your debt."
      ], "Villager");
    }
  }
  
  checkInteractions() {
    // Check if the player is near an NPC
    for (const npc of this.npcs) {
      const distance = Math.sqrt(
        Math.pow(this.player.x - npc.x, 2) + 
        Math.pow(this.player.y - npc.y, 2)
      );
      
      if (distance < 30) {
        this.showDialogBasedOnQuestProgress();
        return;
      }
    }
  }
  
  checkExits() {
    // Check if player is in the exit zone
    if (this.exitZone.contains(this.player.x, this.player.y)) {
      if (this.isInterior) {
        // Exit to village exterior
        window.JRPG.sceneManager.changeScene(VillageScene, { isInterior: false });
      } else {
        // Exit to world map
        window.JRPG.sceneManager.changeScene(WorldMapScene);
      }
    }
    
    // Check if player is entering their house (in exterior scene)
    if (!this.isInterior && this.houseEntrance && this.houseEntrance.contains(this.player.x, this.player.y)) {
      window.JRPG.sceneManager.changeScene(VillageScene, { isInterior: true });
    }
  }
  
  update(delta) {
    // Update player
    this.player.update(delta);
    
    // Update NPCs
    for (const npc of this.npcs) {
      npc.update(delta);
    }
    
    // Update dialog box
    this.dialogBox.update(delta);
    
    // Check for exits
    if (!this.dialogBox.visible) {
      this.checkExits();
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