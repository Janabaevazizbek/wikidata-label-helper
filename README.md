# label-helper
Gadget on the karakalpak Wikipedia - see [Wikipedia:Gadjetler/Wikimaǵlıwmat atamasın qosıwshı](https://kaa.wikipedia.org/wiki/Wikipedia:Gadjetler/Wikimaǵlıwmat_atamasın_qosıwshı). Uses [libSettings](https://github.com/galobtter/libSettings) for settings.
![](https://raw.githubusercontent.com/galobtter/label-helper/master/Label_helper_editing_screenshot.png)

# Wikidata Label Helper

A lightweight MediaWiki gadget that allows Wikipedia editors to add, edit, or update Wikidata labels directly from article, category, and template pages without leaving the local wiki.

## Features
* **Inline Editing:** Edit labels directly under the main page heading, keeping visual consistency with Shortdesc helper.
* **Multi-Namespace Support:** Works flawlessly on Articles (NS 0), Templates (NS 10), and Categories (NS 14).
* **Keyboard Shortcuts:** Fast saving by simply pressing `Enter`.
* **Clean Interface:** Styled with official MediaWiki UI styles (OOUI), featuring a character counter and custom edit summaries.

## Installation

To install this gadget on your local MediaWiki project, follow these steps:

1. Create the JavaScript file at `MediaWiki:Gadget-Label-helper.js` and paste the content of `Label-helper.js` from this repository.
2. Create the CSS file at `MediaWiki:Gadget-Label-helper-pagestyles-vector.css` and paste the content of `Label-helper-pagestyles-vector.css`.
3. Add the following definitions to your local `MediaWiki:Gadgets-definition`:

```text
* Label-helper-loader[ResourceLoader|skins=vector,vector-2022,monobook,modern,timeless|peers=Label-helper-pagestyles-vector]|Label-helper.js
* Label-helper-pagestyles-vector[hidden|skins=vector,vector-2022]|Label-helper-pagestyles-vector.css
