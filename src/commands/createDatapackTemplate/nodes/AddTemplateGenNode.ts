import path from 'path';
import { locale } from '../../../locales';
import { GenerateError } from '../../../types/Error';
import { isDatapackRoot } from '../../../utils/common';
import { readFile } from '../../../utils/file';
import { listenDir } from '../../../utils/vscodeWrapper';
import { AbstractNode } from '../types/AbstractNode';

export class AddTemplateGenNode extends AbstractNode {
    readonly isGeneratePackMcMeta = false;

    async listenGenerateDir(): Promise<string> {
        const dir = await listenDir(
            locale('create-datapack-template.dialog-title-datapack'),
            locale('create-datapack-template.dialog-label')
        ).then(v => v.fsPath);

        if (!await isDatapackRoot(dir)) throw new GenerateError(locale('create-datapack-template.not-datapack'));
        return dir;
    }

    listenDatapackNameAndRoot(directory: string): Promise<{ name: string; root: string }> {
        const name = path.basename(directory);
        const root = directory;
        return Promise.resolve({ name, root });
    }

    async listenDatapackDescription(directory: string): Promise<string> {
        try {
            return JSON.parse(await readFile(path.join(directory, 'pack.mcmeta'))).pack?.description ?? '';
        } catch (err) {
            if (err instanceof SyntaxError) return '';
            throw err;
        }
    }
}