// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "time-stramp-tool" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('time-stramp-tool.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from time-stramp-tool!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.fillTodo', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const documentPath = document.uri.fsPath; // 获取当前文档的文件系统路径
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri); // 获取当前文档所在的工作区目录

            if (workspaceFolder) {
                const gitVersion = getGitVersion(workspaceFolder.uri.fsPath); // 使用工作区目录路径获取 Git 版本号
                const currentDate = new Date().toISOString().split('T')[0]; // 获取当前日期
                const todoText = `TODO ${currentDate} git.V.${gitVersion}: `;
                const position = editor.selection.active;

                editor.edit(editBuilder => {
                    editBuilder.insert(position, todoText);
                });
            }
        }
    });

    context.subscriptions.push(disposable);
}

function getGitVersion(workspaceFolderPath: string): string {
    try {
        process.chdir(workspaceFolderPath); // 更改 Node.js 的当前工作目录
        const gitVersionFull = execSync('git rev-parse HEAD').toString().trim();
        const gitVersionShort = gitVersionFull.substring(0, 5); // 截取版本号的前五位
        return gitVersionShort;
    } catch (e) {
        console.error('Error getting Git version:', e);
        return 'unknown';
    }
}


// 这里可以添加更多的插件生命周期处理逻辑
