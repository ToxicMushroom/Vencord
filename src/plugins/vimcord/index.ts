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
import definePlugin from "@utils/types";

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

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 48 &&
        rect.left >= 0 &&
        rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - 68) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/** Moves the current view n * (25px, or 50px with modifier) */
function moveStatic(n: number, mod: boolean) {
    const msgNav = document.getElementById("messagesNavigationDescription");
    const scroller = msgNav?.parentElement?.parentElement?.parentElement;
    // TODO: remove cursed
    const modMult = <number><unknown>mod + 1;
    const amount = n * 25 * modMult;

    if (scroller) {
        scroller.scrollBy(0, amount);
    } else {
        console.warn("Did not find a scrollable surface on this screen");
    }
}


interface KeyHandler {
    handleKeyDown(k: KeyboardEvent);
}


class InsertMode implements KeyHandler {
    handleKeyDown(k: KeyboardEvent) {
        switch (k.keyCode) {
            case (KEY_ESCAPE):
                mode = new NormalMode();
                break;

        }
    }

}
class NormalMode implements KeyHandler {
    handleKeyDown(k: KeyboardEvent) {
        switch (k.keyCode) {
            case (KEY_I):
                mode = new InsertMode();
                break;
            case (KEY_J):
                moveStatic(1, k.shiftKey);
                break;
            case (KEY_K):
                moveStatic(-1, k.shiftKey);
                break;
        }
        k.preventDefault();
        k.stopImmediatePropagation();
    }
}

let mode = new NormalMode();

export default definePlugin({
    name: "VimCord",
    description: "Adds a vim-like mode to your discord chat (navigation and input mode).",
    authors: [Devs.Ven],
    handleKeyDown(k) {
        console.info(k);
        mode.handleKeyDown(k);
    },

    start() {
        console.info("I started");
        document.addEventListener("keydown", this.handleKeyDown, true);
    },

    stop() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
});
