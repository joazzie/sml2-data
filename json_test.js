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

const assertKey = (key, obj) => {
    assert(key in obj, `key ${key} not in obj ${JSON.stringify(obj)}`);
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
        assertKey('name_en', enemy);
        assertKey('name_jp', enemy);
        assertKey('stompable', enemy);
        assertKey('spinnable', enemy);
        assertKey('flammable', enemy);
        assertKey('starrable', enemy);
        assertKey('boss', enemy);
    });
});

test('all enemies have correct field data', () => {
    enemies.forEach(enemy => {
        assertName(enemy.name_en, `english name of ${JSON.stringify(enemy)} is wrong`);
        assertName(enemy.name_jp, `japanese name of ${JSON.stringify(enemy)} is wrong`);
        assert(typeof enemy.stompable === 'boolean');
        assert(typeof enemy.spinnable === 'boolean');
        assert(typeof enemy.flammable === 'boolean');
        assert(typeof enemy.starrable === 'boolean');
        assert(typeof enemy.boss === 'boolean');
    });
});

test('no duplicate enemy names', () => {
    enemies.forEach((enemy, enemyIndex) => {
        for (let index = enemyIndex + 1; index < enemies.length; index++) {
            assert(enemy.name_en !== enemies[index].name_en, `duplicate english name: ${enemy.name_en}`);
            assert(enemy.name_jp !== enemies[index].name_jp, `duplicate japanese name: ${enemy.name_jp}`);
        }
    });
});

test('english names are lowercase', () => {
    enemies.forEach(enemy => {
        assert(enemy.name_en === enemy.name_en.toLowerCase(), `${enemy.name_en} not lowercase`);
    });
});

test('correct amount of bosses', () => {
    let bosses = 0;
    enemies.forEach(enemy => {
        if (enemy.boss) bosses += 1;
    });

    // 3 pigs + 5 regular + 1 wario
    const expected =  3 + 5 + 1;
    assert(bosses === expected, `found: ${bosses}, expected: ${expected}`);
});

/// level tests
test('all levels have all fields', () => {
    levels.forEach(level => {
        assertObject(level);
        assertKey('zone', level);
        assertKey('stage', level);
        assertKey('stars', level);
        assertKey('coins', level);
        assertKey('question_blocks', level);
        assertKey('money_bags', level);
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

            assert(level.stage !== testLevel.stage, `duplicate level: ${level.zone}${level.stage}`);
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
        assertKey('enemy_name_en', data);
        assertKey('level_zone', data);
        assertKey('level_stage', data);
        assertKey('amount', data);
    });
});

test('all enemy_levels have correct field data', () => {
    enemy_level.forEach(data => {
        assertName(data.enemy_name_en);
        assertName(data.level_stage);
        assertName(data.level_zone);
        assertAmount(data.amount);
    });
});

test('all enemy_level entries have field data of other tables', () => {
    enemy_level.forEach(data => {
        assert(
            enemies.find(enemy => enemy.name_en === data.enemy_name_en) !== undefined,
            `no enemy with name: ${data.enemy_name_en}`
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
            enemy_level.find(data => data.enemy_name_en === enemy.name_en) !== undefined,
            `no enemy in data with name: ${enemy.name_en}`
        );
    });
});
