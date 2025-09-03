## A collection of Super Mario Land 2 data.

### Levels
Level data can be found in `./levels.json`, which is specified as:
```ts
interface Level {
    zone: "overworld" | "tree" | "space" | "macro" | "pumpkin" | "mario" | "turtle";
    stage: string;
    stars: number;
    coins: number;
    question_blocks: number;
    /** The total amount of money inside moneybags in this level */
    money_bags: number;
}

type LevelsJson = Level[];
```

### Enemies
Enemy data can be found in `./enemies.json`, which is specified as:
```ts
interface Enemy {
    /** English name, according to: https://www.nintendo.com/jp/character/mario/en/history/land2/index.html */
    name_en: string;
    /** Japanese name, according to: https://www.nintendo.com/jp/character/mario/history/land2/index.html */
    name_jp: string;
    /** An enemy is stompable when mario can bounce on it, whether that damages it or not */
    stompable: boolean;
    /** An enemy is flammable when a fireball damages it */
    flammable: boolean;
    /** An enemy is not starrable if you cannot kill them with a star,
     * **or** if there is no known way of getting a star to them */
    starrable: boolean;
    boss: boolean;
    /**
     * Kill conditions:
     * 
     * 0. Nothing of note
     * 1. Enemy can only be killed by spinning
     * 2. Enemy has to either be stomped twice, or spun on once
     * 3. Enemy dies on interaction (only example: collector) 
     */
    kill_condition: 0 | 1 | 2 | 3;
}

type EnemiesJson = Enemy[];
```

*Note that* both the lowering spikes in turtle 2 and the teeth in turtle 3 are not officially counted as enemies. So they are not present in this list. 

### Enemy-Level connection
To find out which enemies are in which levels you can look at `./enemy_level.json`, which is specified as:
```ts
interface EnemyLevel {
    /** The english enemy name, corresponding to the `name_en` fields in `enemies.json` */
    enemy_name_en: string;
    /** The zone of the level, corresponding to the `zone` fields in `levels.json` */
    level_zone: string;
    /** The stage of the level, corresponding to the `stage` fields in `levels.json` */
    level_stage: string;
    amound: number;
}

type EnemyLevelJson = EnemyLevel[];
```
