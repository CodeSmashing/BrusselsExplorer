"use strict";

import { setUserData } from "./utils.js";
import main from "./js.js";
import sidebar from "./sidebarManager.js";

export let userData = setUserData();
export let toiletData = { array: userData.favourites };

document.addEventListener("DOMContentLoaded", () => {
	main();
	sidebar();
});
