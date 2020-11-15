import { workspace, window, Uri, ProgressLocation } from 'vscode';
import { getDatapackRoot, getDate, getResourcePath, isDatapackRoot, showInputBox } from '../../utils/common';
import path from 'path';
import { TextEncoder } from 'util';
import '../../utils/methodExtensions';
import { packMcMetaData, pickItems } from './utils/data';
import * as file from '../../utils/file';
import { locale } from '../../locales';
import { createMessageItemsHasId } from './types/MessageItems';
import { resolveVars, VariableContainer } from '../../types/VariableContainer';
import { getFileType } from '../../types/FileTypes';
import { codeConsole, config, versionInformation } from '../../extension';
import rfdc from 'rfdc';
import { GenerateFileData } from './types/QuickPickFiles';
import { getVanillaData } from '../../utils/vanillaData';

export async function createDatapack(): Promise<void> {
    // フォルダ選択
    const dir = await window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri: workspace.workspaceFolders?.[0].uri,
        openLabel: locale('create-datapack-template.dialog-label'),
        title: locale('create-datapack-template.dialog-title')
    }).then(v => v?.[0]);
    if (!dir) return;

    // Datapack内部かチェック
    const datapackRoot = await getDatapackRoot(dir.fsPath);
    if (datapackRoot) {
        // 内部なら確認
        const warningMessage = locale('create-datapack-template.inside-datapack', path.basename(datapackRoot));
        const result = await window.showWarningMessage(warningMessage,
            createMessageItemsHasId('yes'),
            createMessageItemsHasId('reselect'),
            createMessageItemsHasId('no')
        );
        if (result === undefined || result.id === 'no') return;
        if (result.id === 'reselect') return await createDatapack();
    }
    create(dir);
}

async function create(dir: Uri): Promise<void> {
    // データパック名入力
    const datapackName = await showInputBox(locale('create-datapack-template.datapack-name'), v => {
        const invalidChar = v.match(/[\\/:*?"<>|]/g);
        if (invalidChar) return locale('error.unexpected-character', invalidChar.join(', '));
        return undefined;
    });
    if (datapackName === undefined) return;
    if (datapackName === '') {
        window.showErrorMessage(locale('create-datapack-template.name-blank'));
        return;
    }

    // データパック名の被りをチェック
    const datapackRoot = path.join(dir.fsPath, datapackName);
    if (await isDatapackRoot(datapackRoot)) {
        // 内部なら確認
        const warningMessage = locale('create-datapack-template.duplicate-datapack', path.basename(datapackRoot));
        const result = await window.showWarningMessage(warningMessage,
            createMessageItemsHasId('yes'),
            createMessageItemsHasId('rename'),
            createMessageItemsHasId('no')
        );
        if (result === undefined || result.id === 'no') return;
        if (result.id === 'rename') return create(dir);
    }

    // 説明入力
    const datapackDescription = await showInputBox(locale('create-datapack-template.datapack-description'));
    if (datapackDescription === undefined) return;

    // 名前空間入力
    const namespace = await showInputBox(locale('create-datapack-template.namespace-name'), v => {
        const invalidChar = v.match(/[^a-z0-9./_-]/g);
        if (invalidChar) return locale('error.unexpected-character', invalidChar.join(', '));
        return undefined;
    });
    if (namespace === undefined) return;
    if (namespace === '') {
        window.showErrorMessage(locale('create-datapack-template.namespace-blank'));
        return;
    }

    const variableContainer: VariableContainer = {
        datapackName,
        datapackDescription,
        namespace,
        date: getDate(config.dateFormat)
    };

    // 生成するファイル/フォルダを選択
    const quickPickItems = [...rfdc()(pickItems), ...config.createDatapackTemplate.customTemplate];
    quickPickItems.forEach(v => v.label = resolveVars(v.label, variableContainer));
    const createItems = await window.showQuickPick(quickPickItems, {
        canPickMany: true,
        ignoreFocusOut: true,
        matchOnDescription: false,
        matchOnDetail: false,
        placeHolder: locale('create-datapack-template.quickpick-placeholder')
    });
    if (!createItems) return;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const funcs = createItems.filter(v => v.func !== undefined).flat(v => v.func!);
    const createItemData = createItems.flat(v => v.generates);
    createItemData.push(rfdc()(packMcMetaData));

    try {
        for (const func of funcs.map((value, index) => ({ value, index }))) {
            await window.withProgress({
                location: ProgressLocation.Notification,
                cancellable: false,
                title: locale('create-datapack-template.progress.title')
            }, async progress => {
                const message = locale('create-datapack-template.progress.download', func.index + 1, funcs.length);
                progress.report({ increment: 0, message });

                const datas = await getVanillaData(
                    config.createDatapackTemplate.dataVersion,
                    versionInformation,
                    func.value,
                    func.value.rel,
                    (_, m) => progress.report({ increment: 100 / m, message })
                );
                for (const data of datas)
                    createItemData.push({ type: 'file', ...data } as GenerateFileData);
            });
        }
    } catch (error) {
        window.showErrorMessage(error.toString());
        codeConsole.appendLine(error.stack ?? error.toString());
        return;
    }

    await window.withProgress({
        location: ProgressLocation.Notification,
        cancellable: false,
        title: locale('create-datapack-template.progress.title')
    }, async progress => {
        const message = locale('create-datapack-template.progress.creating');
        progress.report({ increment: 0, message });

        const enconder = new TextEncoder();

        for (const item of createItemData) {
            const filePath = path.join(dir.fsPath, datapackName, resolveVars(item.rel, variableContainer));

            if (item.type === 'folder') {
                await file.createDir(filePath);
            } else if (!await file.pathAccessible(filePath)) {
                const fileResourcePath = getResourcePath(filePath, datapackRoot, getFileType(filePath, datapackRoot));
                const str = item.content?.map(v => resolveVars(v, { fileResourcePath, ...variableContainer })).join('\r\n');
                await file.createFile(filePath, enconder.encode(str ?? ''));
            }

            progress.report({ increment: 100 / createItemData.length, message });
        }
        window.showInformationMessage(locale('create-datapack-template.complete'));
    });
}