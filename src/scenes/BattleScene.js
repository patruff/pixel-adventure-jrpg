import * as PIXI from 'pixi.js';
import { Scene } from '../utils/Scene';
import { Character } from '../components/Character';
import { DialogBox } from '../components/DialogBox';
import { CombatSystem } from '../components/CombatSystem';

export class BattleScene extends Scene {
  init() {
    // Set from params
    this.enemyType = this.params.enemyType || 'slime';
    this.ReturnScene = this.params.returnScene || null;
    this.onVictory = this.params.onVictory || null;
    
    try {
      // Create help and command boxes (specific to gameplay scenes)
      this.createHelpAndCommandBoxes();
      
      // Create the battle scene
      this.createBackground();
      this.createCombatants();
      this.createUI();
      this.setupCombat();
      this.setupKeyboard();
    } catch (error) {
      console.error("Error initializing BattleScene:", error);
    }
  }
  
  createBackground() {
    // Create a battle background
    this.background = new PIXI.Graphics();
    
    // Background depends on enemy type
    if (this.enemyType === 'boss') {
      // Boss battle background (dark purple)
      this.background.beginFill(0x300030);
      this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
      this.background.endFill();
      
      // Add some scary-looking elements
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * window.JRPG.constants.GAME_WIDTH;
        const y = Math.random() * window.JRPG.constants.GAME_HEIGHT;
        const size = 1 + Math.random() * 3;
        
        this.background.beginFill(0xFFFFFF, 0.5);
        this.background.drawCircle(x, y, size);
        this.background.endFill();
      }
    } else if (this.enemyType === 'cave') {
      // Cave battle background (dark gray)
      this.background.beginFill(0x333333);
      this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
      this.background.endFill();
      
      // Add some cave-like elements
      for (let i = 0; i < 5; i++) {
        const x = 50 + (i * 50);
        const height = 30 + Math.random() * 20;
        
        this.background.beginFill(0x666666);
        this.background.drawPolygon([
          x - 20, window.JRPG.constants.GAME_HEIGHT,
          x, window.JRPG.constants.GAME_HEIGHT - height,
          x + 20, window.JRPG.constants.GAME_HEIGHT
        ]);
        this.background.endFill();
      }
    } else {
      // Regular battle background (grassy field)
      this.background.beginFill(0x7CFC00);
      this.background.drawRect(0, 0, window.JRPG.constants.GAME_WIDTH, window.JRPG.constants.GAME_HEIGHT);
      this.background.endFill();
      
      // Add some grass tufts
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * window.JRPG.constants.GAME_WIDTH;
        const y = Math.random() * window.JRPG.constants.GAME_HEIGHT;
        
        this.background.beginFill(0x006400);
        this.background.drawRect(x, y, 2, 5);
        this.background.endFill();
      }
    }
    
    this.addChild(this.background);
  }
  
  createCombatants() {
    // Create player character
    this.player = new Character({
      isPlayer: true
    });
    
    // Set player position (bottom left)
    this.player.x = window.JRPG.constants.GAME_WIDTH / 4;
    this.player.y = window.JRPG.constants.GAME_HEIGHT / 3 * 2;
    
    // Create enemy based on type
    this.enemy = new Character();
    
    if (this.enemyType === 'boss') {
      // Boss enemy (large purple square)
      this.enemy.sprite.clear();
      this.enemy.sprite.beginFill(0x800080);
      this.enemy.sprite.drawRect(-16, -16, 32, 32);
      this.enemy.sprite.endFill();
      
      // Boss stats
      this.enemy.name = 'Dark Overlord';
      this.enemy.stats = {
        hp: 100,
        maxHp: 100,
        attack: 12,
        defense: 8
      };
    } else if (this.enemyType === 'cave') {
      // Cave enemy (medium gray shape)
      this.enemy.sprite.clear();
      this.enemy.sprite.beginFill(0x808080);
      this.enemy.sprite.drawRect(-12, -12, 24, 24);
      this.enemy.sprite.endFill();
      
      // Cave enemy stats
      this.enemy.name = 'Cave Troll';
      this.enemy.stats = {
        hp: 40,
        maxHp: 40,
        attack: 8,
        defense: 6
      };
    } else {
      // Default slime enemy (small green blob)
      this.enemy.sprite.clear();
      this.enemy.sprite.beginFill(0x00FF00);
      this.enemy.sprite.drawCircle(0, 0, 10);
      this.enemy.sprite.endFill();
      
      // Slime stats
      this.enemy.name = 'Slime';
      this.enemy.stats = {
        hp: 20,
        maxHp: 20,
        attack: 5,
        defense: 3
      };
    }
    
    // Set enemy position (top right)
    this.enemy.x = window.JRPG.constants.GAME_WIDTH / 4 * 3;
    this.enemy.y = window.JRPG.constants.GAME_HEIGHT / 3;
    
    // Add combatants to scene
    this.addChild(this.player);
    this.addChild(this.enemy);
    
    // Set up player stats from game state
    this.player.name = 'Hero';
    this.player.stats = {
      hp: window.JRPG.gameState.playerHealth,
      maxHp: window.JRPG.gameState.playerMaxHealth,
      attack: 10 + this.getWeaponBonus(),
      defense: 5
    };
  }
  
  getWeaponBonus() {
    // Check if player has a weapon in inventory
    const weapon = window.JRPG.gameState.inventory.find(item => item.type === 'weapon');
    return weapon ? weapon.power : 0;
  }
  
  createUI() {
    // Create UI container
    this.ui = new PIXI.Container();
    
    // Add health bars
    this.createHealthBars();
    
    // Add combat menu
    this.createCombatMenu();
    
    // Add dialog box for combat messages
    this.createDialogBox();
    
    this.addChild(this.ui);
  }
  
  createHealthBars() {
    // Player health bar
    this.playerHealthBar = new PIXI.Container();
    
    // Health bar background
    const playerHealthBg = new PIXI.Graphics();
    playerHealthBg.beginFill(0x000000);
    playerHealthBg.drawRect(0, 0, 100, 10);
    playerHealthBg.endFill();
    
    // Health bar fill
    this.playerHealthFill = new PIXI.Graphics();
    this.playerHealthFill.beginFill(0x00FF00);
    this.playerHealthFill.drawRect(0, 0, 100, 10);
    this.playerHealthFill.endFill();
    
    // Health bar text
    this.playerHealthText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 'white'
    });
    this.playerHealthText.x = 0;
    this.playerHealthText.y = 12;
    
    // Player name
    const playerName = new PIXI.Text(this.player.name, {
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 'white',
      fontWeight: 'bold'
    });
    playerName.x = 0;
    playerName.y = -16;
    
    this.playerHealthBar.addChild(playerHealthBg);
    this.playerHealthBar.addChild(this.playerHealthFill);
    this.playerHealthBar.addChild(this.playerHealthText);
    this.playerHealthBar.addChild(playerName);
    
    this.playerHealthBar.x = 20;
    this.playerHealthBar.y = 20;
    
    // Enemy health bar
    this.enemyHealthBar = new PIXI.Container();
    
    // Health bar background
    const enemyHealthBg = new PIXI.Graphics();
    enemyHealthBg.beginFill(0x000000);
    enemyHealthBg.drawRect(0, 0, 100, 10);
    enemyHealthBg.endFill();
    
    // Health bar fill
    this.enemyHealthFill = new PIXI.Graphics();
    this.enemyHealthFill.beginFill(0xFF0000);
    this.enemyHealthFill.drawRect(0, 0, 100, 10);
    this.enemyHealthFill.endFill();
    
    // Health bar text
    this.enemyHealthText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 'white'
    });
    this.enemyHealthText.x = 0;
    this.enemyHealthText.y = 12;
    
    // Enemy name
    const enemyName = new PIXI.Text(this.enemy.name, {
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 'white',
      fontWeight: 'bold'
    });
    enemyName.x = 0;
    enemyName.y = -16;
    
    this.enemyHealthBar.addChild(enemyHealthBg);
    this.enemyHealthBar.addChild(this.enemyHealthFill);
    this.enemyHealthBar.addChild(this.enemyHealthText);
    this.enemyHealthBar.addChild(enemyName);
    
    this.enemyHealthBar.x = window.JRPG.constants.GAME_WIDTH - 120;
    this.enemyHealthBar.y = 20;
    
    // Add health bars to UI
    this.ui.addChild(this.playerHealthBar);
    this.ui.addChild(this.enemyHealthBar);
    
    // Update health displays
    this.updateHealthBars();
  }
  
  updateHealthBars() {
    // Update player health
    const playerHealthPercent = this.player.stats.hp / this.player.stats.maxHp;
    this.playerHealthFill.width = 100 * playerHealthPercent;
    this.playerHealthText.text = `${this.player.stats.hp}/${this.player.stats.maxHp}`;
    
    // Update enemy health
    const enemyHealthPercent = this.enemy.stats.hp / this.enemy.stats.maxHp;
    this.enemyHealthFill.width = 100 * enemyHealthPercent;
    this.enemyHealthText.text = `${this.enemy.stats.hp}/${this.enemy.stats.maxHp}`;
  }
  
  createCombatMenu() {
    // Create combat menu background
    this.combatMenu = new PIXI.Container();
    
    const menuBg = new PIXI.Graphics();
    menuBg.beginFill(0x000066, 0.8);
    menuBg.lineStyle(2, 0xFFFFFF);
    menuBg.drawRoundedRect(0, 0, 160, 100, 8);
    menuBg.endFill();
    
    // Create combat options
    const options = ['Attack', 'Defend', 'Flee'];
    this.menuOptions = [];
    
    options.forEach((option, index) => {
      const text = new PIXI.Text(option, {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 'white'
      });
      
      text.x = 20;
      text.y = 20 + (index * 25);
      text.interactive = true;
      text.buttonMode = true;
      
      // Add selection indicator
      const indicator = new PIXI.Text('>', {
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 'white'
      });
      
      indicator.x = 5;
      indicator.y = text.y;
      indicator.visible = false;
      
      this.menuOptions.push({
        text,
        indicator,
        action: option.toLowerCase()
      });
      
      this.combatMenu.addChild(text);
      this.combatMenu.addChild(indicator);
    });
    
    this.combatMenu.addChildAt(menuBg, 0);
    
    this.combatMenu.x = window.JRPG.constants.GAME_WIDTH / 2 - 80;
    this.combatMenu.y = window.JRPG.constants.GAME_HEIGHT - 120;
    this.combatMenu.visible = true;
    
    // Select first option by default
    this.selectedOption = 0;
    this.menuOptions[this.selectedOption].indicator.visible = true;
    
    this.ui.addChild(this.combatMenu);
  }
  
  createDialogBox() {
    this.dialogBox = new DialogBox({
      width: window.JRPG.constants.GAME_WIDTH - 40,
      height: 60,
      x: 20,
      y: window.JRPG.constants.GAME_HEIGHT - 80
    });
    
    this.dialogBox.x = 20;
    this.dialogBox.y = window.JRPG.constants.GAME_HEIGHT - 80;
    
    this.ui.addChild(this.dialogBox);
  }
  
  setupCombat() {
    // Create combat system
    this.combat = new CombatSystem(this);
    
    // Set up combat end callback
    this.combat.onCombatEnd = this.handleCombatEnd.bind(this);
    
    // Start combat
    const startMessage = this.combat.startCombat(this.player, this.enemy);
    this.showMessage(startMessage);
  }
  
  setupKeyboard() {
    // Setup keyboard for menu navigation
    this.keys = {
      up: keyboard('ArrowUp'),
      down: keyboard('ArrowDown'),
      action: keyboard('Enter'),
      cancel: keyboard('Escape')
    };
    
    // Key press handlers
    this.keys.up.press = () => {
      if (this.anyMenuVisible()) {
        if (this.combatMenu && this.combatMenu.visible && this.menuOptions && this.menuOptions.length) {
          this.menuOptions[this.selectedOption].indicator.visible = false;
          this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
          this.menuOptions[this.selectedOption].indicator.visible = true;
        }
      }
    };
    
    this.keys.down.press = () => {
      if (this.anyMenuVisible()) {
        if (this.combatMenu && this.combatMenu.visible && this.menuOptions && this.menuOptions.length) {
          this.menuOptions[this.selectedOption].indicator.visible = false;
          this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
          this.menuOptions[this.selectedOption].indicator.visible = true;
        }
      }
    };
    
    this.keys.action.press = () => {
      if (this.commandBox && this.commandBox.visible) {
        this.hideAllMenus();
        return;
      }
      
      if (this.combatMenu && this.combatMenu.visible && this.menuOptions && this.menuOptions.length) {
        this.executeAction(this.menuOptions[this.selectedOption].action);
      }
    };
  }
  
  executeAction(action) {
    // Hide combat menu while action is performed
    this.combatMenu.visible = false;
    
    // Execute selected action
    let result;
    
    switch (action) {
      case 'attack':
        result = this.combat.executeAction('attack', this.player, this.enemy);
        break;
      case 'defend':
        result = this.combat.executeAction('defend', this.player);
        break;
      case 'flee':
        result = this.combat.executeAction('flee', this.player);
        break;
    }
    
    // Show result message
    this.showMessage(result);
    
    // Update health bars
    this.updateHealthBars();
  }
  
  showMessage(message) {
    this.dialogBox.setText(message);
    this.dialogBox.options.onComplete = () => {
      // If combat is still active, show menu again
      if (this.combat.isActive) {
        this.combatMenu.visible = true;
      }
    };
  }
  
  handleCombatEnd(result, message) {
    // Show end message
    this.showMessage(message);
    
    // Update player health in game state
    window.JRPG.gameState.playerHealth = this.player.stats.hp;
    
    // Set dialog completion callback
    this.dialogBox.options.onComplete = () => {
      // Execute victory callback if provided and player won
      if (result === 'victory' && this.onVictory) {
        this.onVictory();
      }
      
      // Return to previous scene
      if (this.ReturnScene) {
        window.JRPG.sceneManager.changeScene(this.ReturnScene);
      }
    };
  }
  
  anyMenuVisible() {
    return (
      (this.dialogBox && this.dialogBox.visible) || 
      (this.commandBox && this.commandBox.visible) ||
      (this.combatMenu && this.combatMenu.visible)
    );
  }
  
  hideAllMenus() {
    if (this.dialogBox) this.dialogBox.close();
    if (this.commandBox) this.commandBox.hide();
    if (this.combatMenu) this.combatMenu.visible = false;
  }

  update(delta) {
    // Update player
    if (this.player) this.player.update(delta);
    
    // Update enemy
    if (this.enemy) this.enemy.update(delta);
    
    // Update dialog box
    if (this.dialogBox) this.dialogBox.update(delta);
  }
  
  destroy() {
    // Clean up keyboard listeners
    if (this.keys) {
      for (const key of Object.values(this.keys)) {
        if (key && key.unsubscribe) {
          key.unsubscribe();
        }
      }
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