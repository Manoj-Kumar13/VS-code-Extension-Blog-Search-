const vscode = require("vscode");
const axios = require("axios");
const xmlParser = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
  const res = await axios.get("https://blog.webdevsimplified.com/rss.xml");
  const articles = xmlParser
    .parse(res.data)
    .rss.channel.item.map((article) => ({
      label: article.title,
      detail: article.description,
      link: article.link,
    }));

  let disposable = vscode.commands.registerCommand(
    "blog-search-example.helloWorld",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      if (article == null) return;

      vscode.env.openExternal(article.link);

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from Blog Search Example!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
