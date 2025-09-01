import enemies from './enemies.json' with {type: "json"};
import levels from './levels.json' with {type: "json"};
import enemy_level from './enemy_level.json' with {type: "json"};

const test = (name, fn) => {
    try {
        fn();
        console.log(`✓ ${name}`);
    } catch (e) {
        console.log(`✗ ${name}`);
        console.error(e);
    }
}

const assert = (pred, msg = '') => {
    if (!pred) throw new Error(`assert failed ${msg}`);
}

const assertObject = (obj, msg = '') => {
    assert(typeof obj === 'object' && obj !== null, msg);
}

const assertAmount = (amount, msg = '') => {
    assert(typeof amount === 'number' && amount >= 0, msg);
}

const assertName = (name, msg = '') => {
    assert(typeof name === 'string' && name !== '', msg);
}

/// tests
test('all json data is an array', () => {
    assert(Array.isArray(enemies));
    assert(Array.isArray(levels));
    assert(Array.isArray(enemy_level));
});

/// enemy tests
test('all enemies have all fields', () => {
    enemies.forEach(enemy => {
        assertObject(enemy);
        assert('name' in enemy);
        assert('stompable' in enemy);
        assert('spinable' in enemy);
        assert('flammable' in enemy);
        assert('starrable' in enemy);
    });
});

test('all enemies have correct field data', () => {
    enemies.forEach(enemy => {
        assertName(enemy.name);
        assert(typeof enemy.stompable === 'boolean');
        assert(typeof enemy.spinable === 'boolean');
        assert(typeof enemy.flammable === 'boolean');
        assert(typeof enemy.starrable === 'boolean');
    });
});

test('no duplicate enemy names', () => {
    enemies.forEach((enemy, enemyIndex) => {
        for (let index = enemyIndex + 1; index < enemies.length; index++) {
            assert(enemy.name !== enemies[index].name);
        }
    });
});

/// level tests
test('all levels have all fields', () => {
    levels.forEach(level => {
        assertObject(level);
        assert('zone' in level);
        assert('stage' in level);
        assert('stars' in level);
        assert('coins' in level);
        assert('question_blocks' in level);
        assert('money_bags' in level);
    });
});

test('all levels have correct field data', () => {
    levels.forEach(level => {
        assertName(level.zone);
        assertName(level.stage);
        assertAmount(level.stars);
        assertAmount(level.coins);
        assertAmount(level.question_blocks);
        assertAmount(level.money_bags);
    });
});

test('no duplicate level names in zones', () => {
    levels.forEach((level, levelIndex) => {
        for (let index = levelIndex + 1; index < levels.length; index++) {
            const testLevel = levels[index];
            if (testLevel.zone !== level.zone) continue;

            assert(level.stage !== testLevel.stage);
        }
    });
});

test('correct amount of total zones', () => {
    const foundZones = [];

    levels.forEach(level => {
        if (!foundZones.includes(level.zone)) {
            foundZones.push(level.zone);
        }
    });

    assert(foundZones.length === 6 + 1);
});

/// enemy_level tests
test('all enemy_levels have all fields', () => {
    enemy_level.forEach(data => {
        assertObject(data);
        assert('enemy_name' in data);
        assert('level_zone' in data);
        assert('level_stage' in data);
        assert('amount' in data);
    });
});

test('all enemy_levels have correct field data', () => {
    enemy_level.forEach(data => {
        assertName(data.enemy_name);
        assertName(data.level_stage);
        assertName(data.level_zone);
        assertAmount(data.amount);
    });
});

test('all enemy_level entries have field data of other tables', () => {
    enemy_level.forEach(data => {
        assert(
            enemies.find(enemy => enemy.name === data.enemy_name) !== undefined,
            `no enemy with name: ${data.enemy_name}`
        );

        assert(
            levels.find(level => level.zone === data.level_zone && level.stage === data.level_stage) !== undefined,
            `no level with zone: ${data.level_zone}, and stage: ${data.level_stage}`
        );
    });
});

test('all enemies exist in enemy_level data', () => {
    enemies.forEach(enemy => {
        assert(
            enemy_level.find(data => data.enemy_name === enemy.name) !== undefined,
            `no enemy in data with name: ${enemy.name}`
        );
    });
});
