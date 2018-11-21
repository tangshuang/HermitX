var hermitPlayers = [];
hermitInit();

console.log("\n %c Hermit X Music Helper v" + HermitX.version + " %c https://lwl.moe/HermitX \n", "color: #fff; background: #4285f4; padding:5px 0;", "background: #66CCFF; padding:5px 0;");

function cloneObject(src) {
	if (src == null || typeof src != "object") {
		return src;
	}
	if (src instanceof Date) {
		var clone = new Date(src.getDate());
		return clone;
	}
	if (src instanceof Array) {
		var clone = [];
		for (var i = 0, len = src.length; i < len; i++) {
			clone[i] = src[i];
		}
		return clone;
	}
	if (src instanceof Object) {
		var clone = {};
		for (var key in src) {
			if (src.hasOwnProperty(key)) {
				clone[key] = cloneObject(src[key]);
			}
		}
		return clone;
	}
}

function hermitPut(element) {
	let songs = element.dataset.songs;
	if (!songs) {
		return
	}

	let option = cloneObject(element.dataset);
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		option.storageName = "HxAP-Setting";
		if (this.readyState === 4) {
			if (this.status >= 200 && this.status < 300 || this.status === 304) {
				var response = JSON.parse(this.responseText);

				option.music = response.msg.songs;
				option.element = element;

				if (option.music === undefined) {
					console.warn("Hermit-X failed to load " + option.songs);
					return false;
				}
				if (option.showlrc === undefined) {
					if (option.music[0].lrc) {
						option.lrcType = 3;
					} else {
						option.lrcType = 0;
					}
				}
				if (option.music.length === 1) {
					option.music = option.music[0];
				}
				if (option.autoplay) {
					option.autoplay = (option.autoplay === "true");
				}
				if (option.listfolded) {
					option.listFolded = (option.listfolded === "true");
				}
				if (option.mutex) {
					option.mutex = (option.mutex === "true");
				}
				if (option.narrow) {
					option.narrow = (option.narrow === "true");
				}

				let player = new APlayer(option);

				player.parseRespons = response;
				hermitPlayers.push(player);
				element.hermitPlayer = player;
			}
			else {
				console.error("Request was unsuccessful: " + this.status);
			}
		}
	};

	let scope = option.songs.split("#:");
	let apiurl = HermitX.ajaxurl + "?action=hermit&scope=" + scope[0] + "&id=" + scope[1] + "&_nonce=" + option._nonce;

	xhr.open("get", apiurl, true);
	xhr.send(null);
}

function hermitInit() {
	for (var i = 0; i < hermitPlayers.length; i++) {
		try { hermitPlayers[i].destroy(); } catch (e) {}
	}

	hermitPlayers = [];

	let elements = document.getElementsByClassName("aplayer");

	for (let i = 0, len = elements.length; i < len; i++) {
		let element = elements[i];
		hermitPut(element);
	}
}

function hermitReload(element) {
	if (element.hermitPlayer) {
		element.hermitPlayer.destroy()
	}
	hermitPut(element);
}
