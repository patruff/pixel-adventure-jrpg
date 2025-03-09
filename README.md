# Pixel Adventure - A PixiJS JRPG

A simple JRPG-style game built with PixiJS.

## Project Overview

This is a small JRPG-style game that includes:

- Multiple game scenes (Village, World Map, Cave, Battle)
- Simple combat system
- Dialog system
- Quest progression
- Basic inventory system

## How to Play

### Installation

1. Make sure you have Node.js installed
2. Clone this repository
3. Run the setup script:

```bash
./setup.sh
```

Or manually install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

### Controls

- **Arrow Keys**: Move character
- **Space**: Interact with objects/NPCs
- **Enter**: Confirm selection (in battle)
- **Up/Down**: Navigate menu options (in battle)

### Game Flow

1. Start at the hero's house with the Old Sage
2. Talk to the Old Sage to start your quest
3. Exit to the village
4. Navigate to the world map
5. Travel to the cave
6. Find the treasure chest inside the cave
7. Defeat the boss
8. Return to the village as the hero!

## Technical Details

This game is built using:

- **PixiJS**: For rendering
- **Vite**: For bundling and development
- **JavaScript**: For game logic

## Project Structure

```
project/
├── index.html
├── package.json
├── src/
│   ├── main.js             # Main entry point
│   ├── assets/             # All game assets
│   │   ├── sprites/        # Character sprites
│   │   ├── tiles/          # Map tiles
│   │   ├── ui/             # UI elements
│   │   └── audio/          # Sound effects and music
│   ├── scenes/             # Game scenes
│   │   ├── TitleScene.js
│   │   ├── VillageScene.js
│   │   ├── WorldMapScene.js
│   │   ├── CaveScene.js
│   │   └── BattleScene.js
│   ├── components/         # Reusable game components
│   │   ├── Character.js     
│   │   ├── DialogBox.js
│   │   ├── CombatSystem.js
│   │   └── TreasureChest.js
│   └── utils/              # Helper functions
└── vite.config.js          # Build configuration
```

## Asset Generation

The game currently uses placeholder graphics rendered with PIXI.Graphics. To add pixel art assets:

1. Generate pixel art assets according to the specifications in `assets_to_generate.md`
2. Place them in the appropriate folders under `src/assets/`
3. Update the `AssetLoader.js` file to load these assets correctly
4. Rebuild and run the game

### Asset Requirements

See `assets_to_generate.md` for detailed specifications of all required assets, including:

- Character sprites (hero, NPCs)
- Buildings and terrain
- Cave elements
- Monsters and boss
- UI elements and icons
- Treasure chest

## Future Improvements

- Add sound effects and music
- Implement more complex battle mechanics
- Add more enemy types
- Expand the world with more locations
- Add a save/load system

## License

MIT