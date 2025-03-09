# Pixel Art Assets to Generate for JRPG

## Characters

### Hero Character Sprite Sheet
- Size: 16x16 pixels per frame
- Format: PNG with transparency
- Frames needed:
  - Walking in 4 directions (3 frames each: up, down, left, right)
  - Idle stance in 4 directions (1 frame each: up, down, left, right)
  - Combat stance (1 frame)
  - Attack animation (2 frames)
- Style: Classic RPG warrior with sword and simple armor
- Prompt for generation: "16x16 pixel art RPG hero character sprite sheet with walking animations in four directions, idle poses, combat stance, and attack animation frames. Classic fantasy warrior style with sword and simple armor. Clear pixels, no anti-aliasing."

### NPCs
- Size: 16x16 pixels per frame
- Format: PNG with transparency
- Characters needed:
  1. Old Sage - elderly wizard/mentor figure
  2. Villager 1 - farmer/peasant
  3. Villager 2 - merchant/shopkeeper
  4. Villager 3 - child
- Each NPC needs:
  - Idle frame (1 frame)
  - Simple movement (2 frames)
- Prompt for generation: "16x16 pixel art RPG NPC character sheet for [character type]. Include one idle pose and two simple movement animation frames. Clear pixel edges, no anti-aliasing."

## World Elements

### Village Buildings
- Size: 64x64 pixels
- Format: PNG with transparency
- Buildings needed:
  1. Hero's house (simple cottage)
  2. Village shop
  3. Elder's house/temple
- Prompt for generation: "64x64 pixel art RPG [building type] for a fantasy village. Top-down perspective with clear pixel edges, no anti-aliasing."

### Interior Elements
- Size: 16x16 pixels
- Format: PNG with transparency
- Items needed:
  1. Table
  2. Chair
  3. Bed
  4. Chest/storage
- Prompt for generation: "16x16 pixel art RPG interior [item type]. Top-down perspective for a fantasy game. Clear pixel edges, no anti-aliasing."

### Terrain Tiles
- Size: 16x16 pixels per tile
- Format: PNG with transparency
- Tiles needed:
  1. Grass (2-3 variations)
  2. Path/dirt (2 variations)
  3. Mountains (2-3 variations)
  4. Forest/trees (2-3 variations)
  5. Water (2 variations)
- Prompt for generation: "16x16 pixel art RPG terrain tiles for [terrain type]. Include 2-3 variations. Top-down perspective, clear pixel edges, no anti-aliasing."

### Cave Entrance
- Size: 48x48 pixels
- Format: PNG with transparency
- Prompt for generation: "48x48 pixel art RPG cave entrance for a fantasy game. Dark ominous opening in rocky terrain. Top-down perspective, clear pixel edges, no anti-aliasing."

### Cave Environment
- Size: 16x16 pixels per tile
- Format: PNG with transparency
- Items needed:
  1. Cave wall tiles (2-3 variations)
  2. Cave floor tiles (2 variations)
  3. Stalagmites (2 variations)
  4. Torches (2 frames: lit with subtle animation)
- Prompt for generation: "16x16 pixel art RPG [cave element] tiles. Dark fantasy dungeon style. Top-down perspective, clear pixel edges, no anti-aliasing."

## Combat Elements

### Monsters
- Size: 32x32 pixels
- Format: PNG with transparency
- Monsters needed:
  1. Slime (basic enemy)
  2. Bat or similar cave creature
  3. Skeleton or undead
- Each monster needs:
  - Idle frame (1 frame)
  - Attack animation (2 frames)
- Prompt for generation: "32x32 pixel art RPG [monster type]. Include one idle pose and two attack animation frames. Fantasy game style, clear pixel edges, no anti-aliasing."

### Boss Monster
- Size: 64x64 pixels
- Format: PNG with transparency
- Needs:
  - Idle frame (1 frame)
  - Attack animation (2 frames)
- Prompt for generation: "64x64 pixel art RPG boss monster. Dark sorcerer or demon style. Include one idle pose and two attack animation frames. Imposing and menacing design with clear pixel edges, no anti-aliasing."

## UI Elements

### Health Bar
- Size: 64x8 pixels
- Format: PNG with transparency
- Needs:
  - Empty bar
  - Full bar (for color overlay)
- Prompt for generation: "64x8 pixel art RPG health bar. Simple design with clear border and inner area for health display. Clear pixel edges, no anti-aliasing."

### Skill Icons
- Size: 16x16 pixels
- Format: PNG with transparency
- Icons needed:
  1. Sword/Attack
  2. Shield/Defend
  3. Magic/Special
  4. Potion/Heal
- Prompt for generation: "16x16 pixel art RPG [skill type] icon. Simple recognizable design for a menu button. Clear pixel edges, no anti-aliasing."

### Combat Menu Background
- Size: 160x48 pixels
- Format: PNG with transparency
- Prompt for generation: "160x48 pixel art RPG combat menu background. Semi-transparent panel with a border for displaying combat options. Fantasy style, clear pixel edges, no anti-aliasing."

### Dialog Box
- Size: 256x64 pixels
- Format: PNG with transparency
- Prompt for generation: "256x64 pixel art RPG dialog box. Semi-transparent panel with decorative border for displaying text and character portrait. Fantasy style, clear pixel edges, no anti-aliasing."

### Treasure Chest
- Size: 16x16 pixels
- Format: PNG with transparency
- Needs:
  - Closed state (1 frame)
  - Open state (1 frame)
- Prompt for generation: "16x16 pixel art RPG treasure chest in closed and open states. Fantasy style wooden chest with gold trim. Top-down perspective, clear pixel edges, no anti-aliasing."

## Next Steps After Generation
1. Save each asset in the appropriate src/assets/ subdirectory:
   - Character sprites in src/assets/sprites/
   - Terrain and building tiles in src/assets/tiles/
   - UI elements in src/assets/ui/
2. Update the AssetLoader.js file to load these assets
3. Implement the sprites in their respective component classes