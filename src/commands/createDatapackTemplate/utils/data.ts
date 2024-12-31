/* eslint-disable @typescript-eslint/naming-convention */
import { ReposGetContentResponseData } from '../../../types';
import { GenerateFileData, QuickPickFiles } from '../types/QuickPickFiles';

export const packMcMetaData: GenerateFileData = {
    type: 'file',
    rel: 'pack.mcmeta',
    content: {
        pack: {
            pack_format: 7,
            description: '%datapackDescription%'
        }
    }
};

export const dataFolder: GenerateFileData = {
    type: 'folder',
    rel: 'data/'
};

export const pickItems: { [key in '#load & #tick' | 'Vanilla data' | 'Folders']: QuickPickFiles[] } = {
    '#load & #tick': [
        {
            label: '#load.json & %namespace%:load.mcfunction',
            picked: true,
            generates: [
                {
                    type: 'file',
                    rel: 'data/minecraft/tags/function/load.json',
                    content: {
                        values: [
                            '%namespace%:load'
                        ]
                    },
                    append: {
                        key: 'values',
                        elem: '%namespace%:load'
                    }
                },
                {
                    type: 'file',
                    rel: 'data/%namespace%/function/load.mcfunction',
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
                    rel: 'data/minecraft/tags/function/tick.json',
                    content: {
                        values: [
                            '%namespace%:tick'
                        ]
                    },
                    append: {
                        key: 'values',
                        elem: '%namespace%:tick'
                    }
                },
                {
                    type: 'file',
                    rel: 'data/%namespace%/function/tick.mcfunction',
                    content: []
                }
            ]
        }
    ],
    'Vanilla data': [
        {
            label: 'All Vanilla tags/block',
            generates: [],
            func: [
                {
                    owner: 'misode',
                    repo: 'mcmeta',
                    ref: '%version%-data',
                    path: 'data/minecraft/tags/block',
                    rel: (data: ReposGetContentResponseData): string => data.path
                }
            ]
        },
        {
            label: 'All Vanilla tags/entity_type',
            generates: [],
            func: [
                {
                    owner: 'misode',
                    repo: 'mcmeta',
                    ref: '%version%-data',
                    path: 'data/minecraft/tags/entity_type',
                    rel: (data: ReposGetContentResponseData): string => data.path
                }
            ]
        },
        {
            label: 'All Vanilla tags/fluid',
            generates: [],
            func: [
                {
                    owner: 'misode',
                    repo: 'mcmeta',
                    ref: '%version%-data',
                    path: 'data/minecraft/tags/fluid',
                    rel: (data: ReposGetContentResponseData): string => data.path
                }
            ]
        },
        {
            label: 'All Vanilla tags/item',
            generates: [],
            func: [
                {
                    owner: 'misode',
                    repo: 'mcmeta',
                    ref: '%version%-data',
                    path: 'data/minecraft/tags/item',
                    rel: (data: ReposGetContentResponseData): string => data.path
                }
            ]
        }
    ],
    'Folders': [
        {
            label: 'data/%namespace%/advancement/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/advancement/'
                }
            ]
        },
        {
            label: 'data/%namespace%/function/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/function/'
                }
            ]
        },
        {
            label: 'data/%namespace%/dimension/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/dimension/'
                }
            ]
        },
        {
            label: 'data/%namespace%/dimension_type/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/dimension_type/'
                }
            ]
        },
        {
            label: 'data/%namespace%/loot_table/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/loot_table/'
                }
            ]
        },
        {
            label: 'data/%namespace%/predicate/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/predicate/'
                }
            ]
        },
        {
            label: 'data/%namespace%/recipe/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/recipe/'
                }
            ]
        },
        {
            label: 'data/%namespace%/tags/block/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/tags/block/'
                }
            ]
        },
        {
            label: 'data/%namespace%/tags/entity_type/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/tags/entity_type/'
                }
            ]
        },
        {
            label: 'data/%namespace%/tags/fluid/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/tags/fluid/'
                }
            ]
        },
        {
            label: 'data/%namespace%/tags/function/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/tags/function/'
                }
            ]
        },
        {
            label: 'data/%namespace%/tags/item/',
            generates: [
                {
                    type: 'folder',
                    rel: 'data/%namespace%/tags/item/'
                }
            ]
        }
    ]
};