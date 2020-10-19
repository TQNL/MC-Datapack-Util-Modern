import { GenerateFileData, QuickPickFiles } from './QuickPickFiles';

export const packMcMetaFileData: GenerateFileData = {
    type: 'file',
    relativeFilePath: 'pack.mcmeta',
    content: [
        '{',
        '    "pack": {',
        '        "pack_format": 6,',
        '        "description": "%datapackDescription%"',
        '    }',
        '}'
    ]
};

export const defaultItems: QuickPickFiles[] = [
    // {// TODO
    //     label: `vanilla tags`,
    //     changes: []
    // },
    {
        label: '#load.json & %namespace%:load.mcfunction',
        picked: true,
        generates: [
            {
                type: 'file',
                relativeFilePath: 'data/minecraft/tags/functions/load.json',
                content: [
                    '{',
                    '    "values": [',
                    '        "%namespace%:load"',
                    '    ]',
                    '}'
                ]
            },
            {
                type: 'file',
                relativeFilePath: 'data/%namespace%/functions/load.mcfunction',
                content: []
            }
        ]
    },
    {
        label: '#tick.json & %namespace%:tick.mcfunction',
        picked: true,
        generates: [
            {
                type: 'file',
                relativeFilePath: 'data/minecraft/tags/functions/tick.json',
                content: [
                    '{',
                    '    "values": [',
                    '        "%namespace%:tick"',
                    '    ]',
                    '}'
                ]
            },
            {
                type: 'file',
                relativeFilePath: 'data/%namespace%/functions/tick.mcfunction',
                content: []
            }
        ]
    },
    {
        label: 'data/%namespace%/advancements/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/advancements/'
            }
        ]
    },
    {
        label: 'data/%namespace%/dimensions/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/dimensions/'
            }
        ]
    },
    {
        label: 'data/%namespace%/dimension_types/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/dimension_types/'
            }
        ]
    },
    {
        label: 'data/%namespace%/loot_tables/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/loot_tables/'
            }
        ]
    },
    {
        label: 'data/%namespace%/predicates/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/predicates/'
            }
        ]
    },
    {
        label: 'data/%namespace%/recipes/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/recipes/'
            }
        ]
    },
    {
        label: 'data/%namespace%/tags/blocks/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/tags/blocks/'
            }
        ]
    },
    {
        label: 'data/%namespace%/tags/entity_types/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/tags/entity_types/'
            }
        ]
    },
    {
        label: 'data/%namespace%/tags/fluids/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/tags/fluids/'
            }
        ]
    },
    {
        label: 'data/%namespace%/tags/functions/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/tags/functions/'
            }
        ]
    },
    {
        label: 'data/%namespace%/tags/items/',
        generates: [
            {
                type: 'folder',
                relativeFilePath: 'data/%namespace%/tags/items/'
            }
        ]
    }
];