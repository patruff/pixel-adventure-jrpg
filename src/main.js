import * as PIXI from 'pixi.js';
import { TitleScene } from './scenes/TitleScene';
import { AssetLoader } from './utils/AssetLoader';

// Game constants
const GAME_WIDTH = 320;
const GAME_HEIGHT = 240;
const SCALE = 3;

// Initialize PIXI Application
const app = new PIXI.Application({
  width: GAME_WIDTH * SCALE,
  height: GAME_HEIGHT * SCALE,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});
document.body.appendChild(app.view);

// Scale the game to maintain the pixel art style
app.stage.scale.set(SCALE);

// Current active scene
let currentScene = null;

// Scene manager
const sceneManager = {
  changeScene(Scene, params = {}) {
    if (currentScene) {
      app.stage.removeChild(currentScene);
      currentScene.destroy();
    }
    
    currentScene = new Scene(app, params);
    app.stage.addChild(currentScene);
  }
};

// Global game state
const gameState = {
  playerHealth: 100,
  playerMaxHealth: 100,
  playerLevel: 1,
  inventory: [],
  questProgress: {
    mainQuest: 0,
  },
};

// Initialize asset loader
const assetLoader = new AssetLoader();

// Global access to important game objects
window.JRPG = {
  app,
  sceneManager,
  gameState,
  assets: assetLoader,
  constants: {
    GAME_WIDTH,
    GAME_HEIGHT,
  }
};

// Loading screen
const createLoadingScreen = () => {
  const loadingContainer = new PIXI.Container();
  
  // Background
  const background = new PIXI.Graphics();
  background.beginFill(0x000000);
  background.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  background.endFill();
  
  // Loading text
  const loadingText = new PIXI.Text('Loading...', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 'white',
    align: 'center',
  });
  loadingText.anchor.set(0.5);
  loadingText.x = GAME_WIDTH / 2;
  loadingText.y = GAME_HEIGHT / 2;
  
  // Loading bar background
  const loadingBarBg = new PIXI.Graphics();
  loadingBarBg.beginFill(0x333333);
  loadingBarBg.drawRect(GAME_WIDTH / 4, GAME_HEIGHT / 2 + 20, GAME_WIDTH / 2, 10);
  loadingBarBg.endFill();
  
  // Loading bar fill
  const loadingBarFill = new PIXI.Graphics();
  loadingBarFill.beginFill(0x00FF00);
  loadingBarFill.drawRect(GAME_WIDTH / 4, GAME_HEIGHT / 2 + 20, 0, 10);
  loadingBarFill.endFill();
  
  loadingContainer.addChild(background);
  loadingContainer.addChild(loadingBarBg);
  loadingContainer.addChild(loadingBarFill);
  loadingContainer.addChild(loadingText);
  
  app.stage.addChild(loadingContainer);
  
  return {
    container: loadingContainer,
    updateProgress: (progress) => {
      loadingBarFill.width = (GAME_WIDTH / 2) * progress;
    },
    destroy: () => {
      app.stage.removeChild(loadingContainer);
      loadingContainer.destroy();
    }
  };
};

// Load assets before starting the game
const loadAssets = async () => {
  // Create and show loading screen
  const loadingScreen = createLoadingScreen();
  
  // For now, we're using placeholder graphics, so this will resolve quickly
  // When we have real assets, this would show the progress of loading
  return new Promise(resolve => {
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += 0.1;
      loadingScreen.updateProgress(Math.min(progress, 1));
      
      if (progress >= 1) {
        clearInterval(loadingInterval);
        
        // Small delay to ensure the user sees the completed loading bar
        setTimeout(() => {
          loadingScreen.destroy();
          resolve();
        }, 300);
      }
    }, 100);
    
    // Load assets
    assetLoader.loadAll().then(() => {
      // Set progress to almost complete, allowing the interval to finish
      progress = 0.9;
    });
  });
};

// Start the game
loadAssets().then(() => {
  sceneManager.changeScene(TitleScene);
});