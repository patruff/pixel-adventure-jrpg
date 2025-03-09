import * as PIXI from 'pixi.js';

export class AssetLoader {
  constructor() {
    this.textures = {};
    this.spritesheets = {};
    this.sounds = {};
    this.assetsLoaded = false;
  }
  
  async loadAll() {
    return new Promise((resolve) => {
      // For now, since we're using placeholders, we'll just resolve immediately
      // Later, when we have actual assets, we'll load them using PIXI.Assets
      
      // Example implementation for when we have assets:
      /*
      // Create assets bundle
      const assetManifest = {
        bundles: [
          {
            name: 'sprites',
            assets: this.getSpriteAssets()
          },
          {
            name: 'tiles',
            assets: this.getTileAssets()
          },
          {
            name: 'ui',
            assets: this.getUIAssets()
          },
          {
            name: 'audio',
            assets: this.getAudioAssets()
          }
        ]
      };
      
      // Initialize asset loader
      PIXI.Assets.init({ manifest: assetManifest });
      
      // Load all bundles
      PIXI.Assets.loadBundle(['sprites', 'tiles', 'ui']).then(assets => {
        // Store loaded assets
        this.textures = { ...assets };
        
        // Create spritesheets from textures
        this.createSpritesheets();
        
        this.assetsLoaded = true;
        resolve();
      });
      */
      
      this.assetsLoaded = true;
      resolve();
    });
  }
  
  getSpriteAssets() {
    return [
      // Character sprites
      {
        name: 'hero_spritesheet',
        srcs: '/src/assets/sprites/hero/hero_spritesheet.png'
      },
      {
        name: 'sage',
        srcs: '/src/assets/sprites/npcs/sage.png'
      },
      {
        name: 'villager1',
        srcs: '/src/assets/sprites/npcs/villager1.png'
      },
      {
        name: 'villager2',
        srcs: '/src/assets/sprites/npcs/villager2.png'
      },
      {
        name: 'villager3',
        srcs: '/src/assets/sprites/npcs/villager3.png'
      },
      // Monster sprites
      {
        name: 'slime',
        srcs: '/src/assets/sprites/monsters/slime.png'
      },
      {
        name: 'bat',
        srcs: '/src/assets/sprites/monsters/bat.png'
      },
      {
        name: 'skeleton',
        srcs: '/src/assets/sprites/monsters/skeleton.png'
      },
      {
        name: 'boss',
        srcs: '/src/assets/sprites/monsters/boss.png'
      }
    ];
  }
  
  getTileAssets() {
    return [
      // Village tiles
      {
        name: 'house',
        srcs: '/src/assets/tiles/village/house.png'
      },
      {
        name: 'shop',
        srcs: '/src/assets/tiles/village/shop.png'
      },
      {
        name: 'temple',
        srcs: '/src/assets/tiles/village/temple.png'
      },
      {
        name: 'table',
        srcs: '/src/assets/tiles/village/table.png'
      },
      {
        name: 'chair',
        srcs: '/src/assets/tiles/village/chair.png'
      },
      {
        name: 'bed',
        srcs: '/src/assets/tiles/village/bed.png'
      },
      {
        name: 'chest',
        srcs: '/src/assets/tiles/village/chest.png'
      },
      // Terrain tiles
      {
        name: 'grass_1',
        srcs: '/src/assets/tiles/terrain/grass_1.png'
      },
      {
        name: 'grass_2',
        srcs: '/src/assets/tiles/terrain/grass_2.png'
      },
      {
        name: 'path_1',
        srcs: '/src/assets/tiles/terrain/path_1.png'
      },
      {
        name: 'path_2',
        srcs: '/src/assets/tiles/terrain/path_2.png'
      },
      {
        name: 'mountain_1',
        srcs: '/src/assets/tiles/terrain/mountain_1.png'
      },
      {
        name: 'mountain_2',
        srcs: '/src/assets/tiles/terrain/mountain_2.png'
      },
      {
        name: 'tree_1',
        srcs: '/src/assets/tiles/terrain/tree_1.png'
      },
      {
        name: 'tree_2',
        srcs: '/src/assets/tiles/terrain/tree_2.png'
      },
      {
        name: 'water_1',
        srcs: '/src/assets/tiles/terrain/water_1.png'
      },
      {
        name: 'water_2',
        srcs: '/src/assets/tiles/terrain/water_2.png'
      },
      {
        name: 'cave_entrance',
        srcs: '/src/assets/tiles/terrain/cave_entrance.png'
      },
      // Cave tiles
      {
        name: 'cave_wall_1',
        srcs: '/src/assets/tiles/cave/wall_1.png'
      },
      {
        name: 'cave_wall_2',
        srcs: '/src/assets/tiles/cave/wall_2.png'
      },
      {
        name: 'cave_floor_1',
        srcs: '/src/assets/tiles/cave/floor_1.png'
      },
      {
        name: 'cave_floor_2',
        srcs: '/src/assets/tiles/cave/floor_2.png'
      },
      {
        name: 'stalagmite_1',
        srcs: '/src/assets/tiles/cave/stalagmite_1.png'
      },
      {
        name: 'stalagmite_2',
        srcs: '/src/assets/tiles/cave/stalagmite_2.png'
      },
      {
        name: 'torch_1',
        srcs: '/src/assets/tiles/cave/torch_1.png'
      },
      {
        name: 'torch_2',
        srcs: '/src/assets/tiles/cave/torch_2.png'
      }
    ];
  }
  
  getUIAssets() {
    return [
      {
        name: 'health_bar_empty',
        srcs: '/src/assets/ui/health_bar_empty.png'
      },
      {
        name: 'health_bar_full',
        srcs: '/src/assets/ui/health_bar_full.png'
      },
      {
        name: 'icon_attack',
        srcs: '/src/assets/ui/icon_attack.png'
      },
      {
        name: 'icon_defend',
        srcs: '/src/assets/ui/icon_defend.png'
      },
      {
        name: 'icon_magic',
        srcs: '/src/assets/ui/icon_magic.png'
      },
      {
        name: 'icon_potion',
        srcs: '/src/assets/ui/icon_potion.png'
      },
      {
        name: 'combat_menu_bg',
        srcs: '/src/assets/ui/combat_menu_bg.png'
      },
      {
        name: 'dialog_box',
        srcs: '/src/assets/ui/dialog_box.png'
      },
      {
        name: 'treasure_chest_closed',
        srcs: '/src/assets/ui/treasure_chest_closed.png'
      },
      {
        name: 'treasure_chest_open',
        srcs: '/src/assets/ui/treasure_chest_open.png'
      }
    ];
  }
  
  getAudioAssets() {
    return [
      // Will add audio assets when we have them
      // Example:
      // {
      //   name: 'bgm_village',
      //   srcs: '/src/assets/audio/bgm_village.mp3'
      // }
    ];
  }
  
  createSpritesheets() {
    // Hero animations
    this.spritesheets.hero = this.createAnimations('hero_spritesheet', 16, 16, {
      'idle_down': [0],
      'idle_up': [1],
      'idle_left': [2],
      'idle_right': [3],
      'walk_down': [4, 5, 6],
      'walk_up': [7, 8, 9],
      'walk_left': [10, 11, 12],
      'walk_right': [13, 14, 15],
      'combat': [16],
      'attack': [17, 18]
    });
    
    // Monster animations could be added here as well
  }
  
  getTexture(id) {
    return this.textures[id];
  }
  
  getSpritesheet(id) {
    return this.spritesheets[id];
  }
  
  getSound(id) {
    return this.sounds[id];
  }
  
  createAnimations(textureName, frameWidth, frameHeight, animations) {
    const texture = this.getTexture(textureName);
    if (!texture) return {};
    
    const result = {};
    const baseTexture = texture.baseTexture;
    const columns = Math.floor(baseTexture.width / frameWidth);
    const rows = Math.floor(baseTexture.height / frameHeight);
    
    // Create individual frames
    const frames = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        frames.push(
          new PIXI.Texture(
            baseTexture,
            new PIXI.Rectangle(x * frameWidth, y * frameHeight, frameWidth, frameHeight)
          )
        );
      }
    }
    
    // Create animations from frames based on animation definitions
    for (const [name, frameIndices] of Object.entries(animations)) {
      result[name] = frameIndices.map(i => frames[i]);
    }
    
    return result;
  }
}