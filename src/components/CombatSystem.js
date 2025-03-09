import * as PIXI from 'pixi.js';

export class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.player = null;
    this.enemies = [];
    this.currentTurn = 'player';
    this.isActive = false;
    this.actions = {
      attack: {
        name: 'Attack',
        execute: (source, target) => {
          const damage = Math.max(1, Math.floor(source.stats.attack * (1 + Math.random() * 0.2) - target.stats.defense * 0.5));
          target.stats.hp = Math.max(0, target.stats.hp - damage);
          
          // Return combat log message
          return `${source.name} attacks ${target.name} for ${damage} damage!`;
        }
      },
      defend: {
        name: 'Defend',
        execute: (source) => {
          source.stats.defense += 2;
          
          // Return combat log message
          return `${source.name} defends and gains +2 defense!`;
        }
      },
      skill: {
        name: 'Skill',
        execute: (source, target, skillName) => {
          // Implementation of skill system would go here
          return `${source.name} uses ${skillName} on ${target.name}!`;
        }
      },
      flee: {
        name: 'Flee',
        execute: (source) => {
          const success = Math.random() > 0.3;
          
          if (success) {
            this.endCombat('flee');
          }
          
          // Return combat log message
          return success ? `${source.name} successfully fled!` : `${source.name} failed to flee!`;
        }
      }
    };
    
    this.onCombatEnd = null;
  }
  
  startCombat(player, enemies) {
    this.player = player;
    this.enemies = Array.isArray(enemies) ? enemies : [enemies];
    this.currentTurn = 'player';
    this.isActive = true;
    
    return `Combat started! You are facing ${this.enemies.map(e => e.name).join(', ')}!`;
  }
  
  executeAction(action, source, target, param) {
    if (!this.isActive) return null;
    
    // Execute the action
    const result = this.actions[action].execute(source, target, param);
    
    // Check if any enemy is defeated
    this.checkDefeats();
    
    // Switch turns
    this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
    
    // If it's enemy turn, process enemy actions
    if (this.currentTurn === 'enemy' && this.isActive) {
      setTimeout(() => {
        this.processEnemyTurns();
      }, 1000);
    }
    
    return result;
  }
  
  processEnemyTurns() {
    if (!this.isActive) return;
    
    const results = [];
    
    // Each enemy takes an action
    for (const enemy of this.enemies) {
      if (enemy.stats.hp <= 0) continue;
      
      // Simple AI: always attack player
      const result = this.actions.attack.execute(enemy, this.player);
      results.push(result);
      
      // Check if player is defeated
      if (this.player.stats.hp <= 0) {
        this.endCombat('defeat');
        break;
      }
    }
    
    // Switch turn back to player
    this.currentTurn = 'player';
    
    return results.join('\n');
  }
  
  checkDefeats() {
    // Check if all enemies are defeated
    if (this.enemies.every(enemy => enemy.stats.hp <= 0)) {
      this.endCombat('victory');
      return true;
    }
    
    // Check if player is defeated
    if (this.player.stats.hp <= 0) {
      this.endCombat('defeat');
      return true;
    }
    
    return false;
  }
  
  endCombat(result) {
    this.isActive = false;
    
    let message = '';
    
    switch (result) {
      case 'victory':
        message = 'You defeated all enemies!';
        break;
      case 'defeat':
        message = 'You were defeated!';
        break;
      case 'flee':
        message = 'You fled from combat!';
        break;
    }
    
    if (this.onCombatEnd) {
      this.onCombatEnd(result, message);
    }
    
    return message;
  }
}