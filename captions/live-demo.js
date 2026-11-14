// Hero demo on the Live Captions pages: the caption window under the call screenshot
// plays a short dialogue the way the app shows it - speech arrives word by word
// (character by character in languages written without spaces), each speaker in their
// own color on a new line, the previous line greys out and scrolls up.
// The lines come from data-lines in the page language; the speaker labels are taken
// from the static fallback markup, so they are already translated.
(function () {
    var body = document.querySelector('.mock--live .mock__body');
    if (!body || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var lines;
    try { lines = JSON.parse(body.getAttribute('data-lines') || '[]'); } catch (e) { return; }
    if (!lines.length) return;

    var labels = ['.mock__who--1', '.mock__who--2'].map(function (sel) {
        var el = body.querySelector(sel);
        return el ? el.textContent : '';
    });

    var WORD_MS = 120;
    var CHAR_MS = 90;
    var HOLD_MS = 1600;
    var SCROLL = 'transform .5s cubic-bezier(.4, 0, .2, 1)';
    var index = 0;
    var shown = 0;

    // The feed sits at the bottom of the window; when it grows, it would jump up by the
    // new height. Instead it is pushed back down by that height and eased up to place.
    var feed = document.createElement('div');
    feed.className = 'mock__feed';
    body.textContent = '';
    body.appendChild(feed);

    function currentOffset() {
        var t = getComputedStyle(feed).transform;
        return t && t !== 'none' ? parseFloat(t.split(',')[5]) || 0 : 0;
    }

    function grow(change) {
        var before = feed.offsetHeight;
        change();
        var delta = feed.offsetHeight - before;
        if (!delta) return;
        var from = currentOffset() + delta;
        feed.style.transition = 'none';
        feed.style.transform = 'translateY(' + from + 'px)';
        void feed.offsetHeight;
        feed.style.transition = SCROLL;
        feed.style.transform = 'translateY(0)';
    }

    // Entries that have scrolled fully out of the window are removed. The feed is
    // anchored to the bottom, so dropping them does not move anything still visible.
    function prune() {
        var top = body.getBoundingClientRect().top;
        while (feed.children.length > 1 && feed.firstElementChild.getBoundingClientRect().bottom < top) {
            feed.removeChild(feed.firstElementChild);
        }
    }

    // Speakers alternate by lines shown, not by position in the script: the scripts have
    // an odd number of lines, so on wrap-around one speaker would talk twice in a row.
    function append() {
        var speaker = shown++ % 2;
        var old = feed.querySelectorAll('.mock__line');
        for (var k = 0; k < old.length; k++) old[k].classList.add('mock__line--old');

        var entry = document.createElement('div');
        entry.className = 'mock__entry';
        var label = document.createElement('span');
        label.className = 'mock__who mock__who--' + (speaker + 1);
        label.textContent = labels[speaker];
        var line = document.createElement('p');
        line.className = 'mock__line';
        entry.appendChild(label);
        entry.appendChild(line);
        feed.appendChild(entry);
        return line;
    }

    // Open mid-conversation rather than on an empty window.
    if (lines.length > 2) {
        append().textContent = lines[0];
        append().textContent = lines[1];
        index = 2;
    }

    function addLine() {
        prune();
        var text = lines[index % lines.length];
        var line;
        grow(function () { line = append(); });

        var spaced = /\s/.test(text);
        var parts = spaced ? text.split(/(\s+)/) : Array.from(text);
        var i = 0;
        (function step() {
            grow(function () {
                while (i < parts.length && spaced && /^\s+$/.test(parts[i])) line.textContent += parts[i++];
                if (i < parts.length) line.textContent += parts[i++];
            });
            if (i < parts.length) {
                setTimeout(step, spaced ? WORD_MS : CHAR_MS);
            } else {
                index++;
                setTimeout(addLine, HOLD_MS);
            }
        })();
    }

    setTimeout(addLine, 900);
})();
