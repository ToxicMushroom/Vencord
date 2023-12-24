/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Devs } from "@utils/constants";
import { relaunch } from "@utils/native";
import { canonicalizeMatch, canonicalizeReplace, canonicalizeReplacement } from "@utils/patches";
import definePlugin from "@utils/types";
import * as Webpack from "@webpack";
import { extract, filters, findAll, search } from "@webpack";
import { React, ReactDOM } from "@webpack/common";
import type { ComponentType } from "react";

const WEB_ONLY = (f: string) => () => {
    throw new Error(`'${f}' is Discord Desktop only.`);
};

enum VimMode {
    Nav,
    Insert
}

const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;

const KEY_ESCAPE = 27;
let mode = VimMode.Nav;
export default definePlugin({
    name: "VimCord",
    description: "Adds a vim-like mode to your discord chat (navigation and input mode).",
    authors: [Devs.Ven],
    handleKeyDown(k) {
        console.log(k);
        console.log(`Current mode ${mode}`);

        if (mode === VimMode.Nav) {
            if (k.keyCode === KEY_I) {
                mode = VimMode.Insert;
            } else if (k.keyCode === KEY_J) {
                // scroll up
                const shifted = k.shiftKey;
                if (shifted)
                    console.info("Big scroll up");
            } else if (k.keyCode === KEY_K) {
                // scroll down
            }

            k.preventDefault();
            k.stopPropagation();
        } else if (mode === VimMode.Insert) {
            if (k.keyCode === KEY_ESCAPE) {
                mode = VimMode.Nav;
            }
        }
    },

    start() {
        console.info("I started");
        document.addEventListener("keydown", this.handleKeyDown, true);
    },

    stop() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
});
