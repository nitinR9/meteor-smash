# Meteor Smash
This is a made with phaser version 2.13.3 for [#WeeklyGameJam](https://itch.io/jam/weekly-game-jam-118) topic of game jam was 'spaceship'. Game hosted here [Meteor-Smash](https://nitinr9.itch.io/meteor-smash) this game is now no longer a prototype. Game instructions and controls are specified briefly as follows

### What's New ?

  - Added Electron Support to play on Windows 10 devices
  - Install all packages via `npm install` then run `npm run dist` to make a executable packaged version of game.

### Controls
   - Use &uarr; and &darr; keys to switch between weapons provided, default is at 1.
   - Use &larr; and &rarr; keys to move spaceship in left and right direction.
   - Use Spacebar key to fire your weapon.

### Instructions
   - Main goal is to make score as high as possible, if there is a new highscore then only it will be saved in browser session.
   - There is a Rectangular panel that shows the current health, corepower,overload level and current weapon selected at spaceship.
   - Corepower(yellow bar) indicates energy level required to fire the wepon 2 and 3, if it's zero then those weapons cannot be fired.
   - Overload level(red bar initially empty) means every weapon causes strain towards machinery and increases heat level of the laser canons. If it's value is above 80% then you cannot fire weapon 2 and 3.
   - Also, if overload level reaches 100% it's momentarily decrease spaceship's health by 1HP. This parameter gradually decreases if weapon is not fired continously or can be lowered by absorbing meteor core [explained afterwards].
   - If meteor hits the lasers fired by spaceship and it explodes then only score value will increase, as some of the meteors are tough and cannot be destroyed in one shot.
   - Your mission is make path through those boulders by destroying them.
   - There are 3 levels each one of them have higher difficulty than the previous one. 
   - If health goes below 25% and overload level above 80% then a warning alarm will start buzzing.

### Weapons
There are 3 different types of weapons
   
   - Weapon 1: Uses no extra power but takes more than one hit to destroy meteors. 
   - Weapon 2: Uses extra corepower which can be extracted through meteors, much better than first at damage one but rate of fire is slow.
   - Weapon 3: Uses all remaining corepower to destroy all meteors than come in it's way, fast but increases overload level at much faster rate than the other weapons.
 
Table to show the effectiveness of weapons

| Size of meteor | Weapon 1 | Weapon 2 | Weapon 3 |
| ------ | ------ | ------ | ------ |
| Small | 1 hit | 1 hit | 1 hit |
| Medium | 1-2 hit | 1 hit | 1 hit |
| Large | 2-3 hit | 1-2 hit | 1 hit |

### Meteor Cores

There are 5 different kinds of core that are available in meteors of which 3 are rarely present inside normal meteors and rest of 2 are frequent at occuring inside exploding meteors due to presence of highly unstable core.

Normal Powerup Core
   - Core 1: Green in colour and increase the health of spaceship
   - Core 2: Yellow in colour to refill corepower
   - Core 3: Orange in colour and it reduces overload level by decreasing high temperatures of the engine.

Danger Powerup Core
   - Core 4: Red in colour, it directly reduces health
   - Core 5: Violet in colour, it increases overload level

### Credits
Special thanks to those editors who created those sprites and textures, without them making this game was impossible. Rest of them were taken from different free sources.

https://opengameart.org/content/asteroids-set-02 (for asteroids) <br>
https://opengameart.org/content/space-shooter-music (for menu screen and death sound) <br>
https://www.sccpre.cat/show/iwxbomx_explosion-sprite-sheet-2d-explosion-sprite-s... (explosion sprite sheet) <br>
https://opengameart.org/content/fireball-spell (fireballbullet) <br>
https://opengameart.org/content/stereotypical-90s-space-shooter-music
https://opengameart.org/content/gui-pack (buttons)
