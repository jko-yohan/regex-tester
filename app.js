(() => {
    const patternInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const testString = document.getElementById('test-string');
    const errorDiv = document.getElementById('regex-error');
    const matchCount = document.getElementById('match-count');
    const matchDetails = document.getElementById('match-details');

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function update() {
        const pattern = patternInput.value;
        const flags = flagsInput.value;
        const text = testString.value;

        errorDiv.textContent = '';
        matchDetails.innerHTML = '';
        matchCount.textContent = '0 matches';

        if (!pattern || !text) return;

        let regex;
        try {
            regex = new RegExp(pattern, flags);
        } catch (e) {
            errorDiv.textContent = e.message;
            return;
        }

        const matches = [];
        let match;
        const maxIterations = 10000;
        let iterations = 0;

        if (flags.includes('g')) {
            while ((match = regex.exec(text)) !== null && iterations < maxIterations) {
                matches.push({ value: match[0], index: match.index, groups: match.slice(1) });
                if (match[0].length === 0) regex.lastIndex++;
                iterations++;
            }
        } else {
            match = regex.exec(text);
            if (match) {
                matches.push({ value: match[0], index: match.index, groups: match.slice(1) });
            }
        }

        matchCount.textContent = matches.length + ' match' + (matches.length !== 1 ? 'es' : '');

        let html = '';
        matches.forEach((m, i) => {
            html += '<div class="match-item">';
            html += '<span class="match-label">Match ' + (i + 1) + ':</span>';
            html += '<span class="match-value">"' + escapeHTML(m.value) + '"</span>';
            html += '<span class="match-pos">[' + m.index + '-' + (m.index + m.value.length) + ']</span>';
            if (m.groups.length > 0) {
                m.groups.forEach((g, gi) => {
                    html += '<br><span class="match-label">  Group ' + (gi + 1) + ':</span>';
                    html += '<span class="match-value">"' + escapeHTML(g || '') + '"</span>';
                });
            }
            html += '</div>';
        });
        matchDetails.innerHTML = html;
    }

    patternInput.addEventListener('input', update);
    flagsInput.addEventListener('input', update);
    testString.addEventListener('input', update);
})();
