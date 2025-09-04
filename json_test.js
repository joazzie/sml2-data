import enemies from './enemies.json' with {type: "json"};
import levels from './levels.json' with {type: "json"};
import enemy_level from './enemy_level.json' with {type: "json"};
import projectiles from './projectiles.json' with {type: "json"};

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
    if (!pred) throw new Error(`assert failed: ${msg}`);
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


/// enemy tests
test('all enemies have all fields', () => {
    assert(Array.isArray(enemies));

    enemies.forEach(enemy => {
        assertObject(enemy);
        assertKey('name_en', enemy);
        assertKey('name_jp', enemy);
        assertKey('stompable', enemy);
        assertKey('flammable', enemy);
        assertKey('starrable', enemy);
        assertKey('boss', enemy);
        assertKey('kill_condition', enemy);
    });
});

test('all enemies have correct field data', () => {
    enemies.forEach(enemy => {
        assertName(enemy.name_en, `english name of ${JSON.stringify(enemy)} is wrong`);
        assertName(enemy.name_jp, `japanese name of ${JSON.stringify(enemy)} is wrong`);
        assert(typeof enemy.stompable === 'boolean');
        assert(typeof enemy.flammable === 'boolean');
        assert(typeof enemy.starrable === 'boolean');
        assert(typeof enemy.boss === 'boolean');
        assert(typeof enemy.kill_condition === 'number' && (
            enemy.kill_condition === 0 ||
            enemy.kill_condition === 1 ||
            enemy.kill_condition === 2 ||
            enemy.kill_condition === 3
        ));
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

test('all english names are lowercase', () => {
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

test('all bosses only have one occurence', () => {
    enemies.forEach(enemy => {
        if (enemy.boss) {
            let occurences = 0;

            enemy_level.forEach(appearance => {
                if (appearance.enemy_name_en === enemy.name_en) occurences += appearance.amount;
            });

            assert(occurences === 1, `boss ${enemy.name_en} appears ${occurences} times`);
        };
    })
});

/// level tests
test('all levels have all fields', () => {
    assert(Array.isArray(levels));

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

            assert(level.stage !== testLevel.stage, `duplicate level: ${level.zone} ${level.stage}`);
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

    // 6 zones + 1 overworld
    assert(foundZones.length === 6 + 1);
});

/// enemy_level tests
test('all enemy_levels have all fields', () => {
    assert(Array.isArray(enemy_level));
    
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

/// projectiles
test('all projectiles have all fields', () => {
    assertObject(projectiles);
    
    assertKey('projectiles', projectiles);
    assert(Array.isArray(projectiles.projectiles));
    projectiles.projectiles.forEach(projectile => {
        assertObject(projectile);
        assertKey('name', projectile);
        assertKey('enemy_name_en', projectile);
        assertKey('starrable', projectile);
    });

    assertKey('exist_in', projectiles);
    assert(Array.isArray(projectiles.exist_in));
    projectiles.exist_in.forEach(appearance => {
        assertObject(appearance);
        assertKey('projectile_name', appearance);
        assertKey('level_zone', appearance);
        assertKey('level_stage', appearance);
        assertKey('amount', appearance);
    });
});

test('all projectiles have correct field data', () => {
    projectiles.projectiles.forEach(projectile => {
        assertName(projectile.name);
        assert(projectile.enemy_name_en === null || typeof projectile.enemy_name_en === 'string');
        assert(typeof projectile.starrable === 'boolean');
    });

    projectiles.exist_in.forEach(appearance => {
        assertName(appearance.projectile_name);
        assertName(appearance.level_zone);
        assertName(appearance.level_stage);
        assertAmount(appearance.amount);
    });
});

test('no duplicate projectile names', () => {
    projectiles.projectiles.forEach((projectile, projectileIndex) => {
        for (let index = projectileIndex + 1; index < projectiles.projectiles.length; index++) {
            assert(projectiles.projectiles[index].name !== projectile.name, `duplicate projectile name: ${projectile.name}`);
        }
    });
});

test('all projectiles have appearances', () => {
    projectiles.projectiles.forEach(projectile => {
        assert(
            projectiles.exist_in.find(appearance => appearance.projectile_name === projectile.name) !== undefined,
            `projectile ${projectile.name} has no appearances`,
        );
    });
});

test('all projectile references point to valid data', () => {
    projectiles.projectiles.forEach(projectile => {
        if (projectile.enemy_name_en !== null) {
            assert(enemies.find(enemy => enemy.name_en === projectile.enemy_name_en) !== undefined);
        }
    });

    projectiles.exist_in.forEach(appearance => {
        assert(projectiles.projectiles.find(projectile => projectile.name === appearance.projectile_name) !== undefined);
        assert(levels.find(level => level.zone === appearance.level_zone && level.stage === appearance.level_stage));
    });
});

test('all projectiles with enemies have the exact same appearances as those enemies', () => {
    projectiles.projectiles.forEach(projectile => {
        if (projectile.enemy_name_en !== null) {
            const enemy = enemies.find(enemy => enemy.name_en === projectile.enemy_name_en);
            assert(enemy !== undefined);

            const enemyAppearances = enemy_level.filter(appearance => appearance.enemy_name_en === enemy.name_en);
            const projectileAppearances = projectiles.exist_in.filter(appearance => appearance.projectile_name === projectile.name);

            enemyAppearances.forEach(appearance => {
                assert(
                    projectileAppearances.find(projectileAppearance =>
                        projectileAppearance.level_zone === appearance.level_zone &&
                        projectileAppearance.level_stage === appearance.level_stage
                    ) !== undefined,
                    `not all appearances of ${enemy.name_en} have a projectile appearance of ${projectile.name}`
                );
            });

            projectileAppearances.forEach(appearance => {
                assert(
                    enemyAppearances.find(enemyAppearance => 
                        enemyAppearance.level_zone === appearance.level_zone &&
                        enemyAppearance.level_stage === appearance.level_stage
                    ) !== undefined,
                    `not all appearances of ${projectile.name} have an enemy appearance of ${enemy.name_en}`
                )
            });
        }
    });
});
