document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const wuNameElement = document.getElementById('wuName');

    // Focus input on load
    nameInput.focus();

    // Generate name on button click
    generateBtn.addEventListener('click', handleGenerate);

    // Generate name on Enter key press
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    });

    function handleGenerate() {
        const inputName = nameInput.value.trim();

        if (!inputName) {
            nameInput.classList.add('error');
            setTimeout(() => nameInput.classList.remove('error'), 400);
            return;
        }

        const result = generateWuName(inputName);

        if (!resultSection.classList.contains('hidden')) {
            resultSection.style.opacity = '0';
            resultSection.style.transform = 'scale(0.95)';
            setTimeout(() => {
                displayResult(result);
            }, 400);
        } else {
            resultSection.classList.remove('hidden');
            displayResult(result);
        }
    }

    function displayResult(result) {
        wuNameElement.textContent = result.name;

        if (result.isPoopVariant) {
            wuNameElement.classList.add('poop-variant');
        } else {
            wuNameElement.classList.remove('poop-variant');
        }

        resultSection.style.opacity = '1';
        resultSection.style.transform = 'scale(1)';

        // Micro-interaction
        wuNameElement.style.transform = result.isPoopVariant ? 'scale(0.8) rotate(1deg)' : 'scale(0.8) rotate(-2deg)';
        setTimeout(() => {
            wuNameElement.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            wuNameElement.style.transform = result.isPoopVariant ? 'scale(1) rotate(1deg)' : 'scale(1) rotate(-2deg)';
        }, 50);
    }

    // A better hash algorithm (cyrb53) to avoid clashing strings like bitwise operations
    function cyrb53(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    function generateWuName(name) {
        const cleanName = name.trim().toLowerCase();

        // Ensure standard consistent hashing per name
        // Added a salt so "Jalen Kroger" doesn't hit 0 again
        const hash = cyrb53(cleanName, 36);

        // Exactly 25% chance of Poop-related ODB variation: hash % 4 === 0
        const isPoopVariant = (hash % 4 === 0);
        let finalName = '';

        if (isPoopVariant) {
            const poopOdbVariations = [
                "Ol' Dirty Poop",
                "Ol' Poopy Bastard",
                "Ol' Dookie Bastard",
                "Ol' Crappy Bastard",
                "Ol' Dirty Turd",
                "Ol' Dirty Crap",
                "Ol' Shitty Bastard",
                "Ol' Stinky Bastard",
                "Poop' Dirty Bastard",
                "Ol' Farty Bastard",
                "Sir Poops-A-Lot Bastard",
                "Ol' Muddy Bastard",
                "The Brown Bastard"
            ];

            finalName = poopOdbVariations[hash % poopOdbVariations.length];
        } else {
            // Authentic Wu-Tang name algorithm based on recombination 
            // of actual original 9 member names + affiliates structure

            const prefixes = [
                "RZA", "GZA", "Method", "Raekwon", "Ghostface", "Inspectah",
                "U", "Masta", "Cappa", "Ol'", "Rebel", "Golden", "Chef",
                "Dirt", "Bobby", "Lex", "Noodles", "Maximillion", "Ghost", "Tony",
                "Shaolin", "Iron", "Wu"
            ];

            const suffixes = [
                "Man", "Killah", "Deck", "God", "Killa", "Donna", "Dirty",
                "Bastard", "INS", "Arms", "Starks", "Digital", "Diamond",
                "Ruler", "Slang", "Dog", "Prophet", "Monk"
            ];

            // Generate deterministic indices based on hash
            const firstIdx = hash % prefixes.length;
            const lastIdx = (Math.floor(hash / prefixes.length)) % suffixes.length;

            const first = prefixes[firstIdx];
            const last = suffixes[lastIdx];

            // Determine structure layout deterministically
            const structureType = (hash % 3);

            if (first === "Raekwon" || first === "Cappadonna") {
                finalName = structureType === 0 ? `${first}` : `${first} The ${last}`;
            } else if (structureType === 1) {
                finalName = `${first} The ${last}`;
            } else if (structureType === 2) {
                finalName = `The ${first} ${last}`;
            } else {
                finalName = `${first} ${last}`;
            }

            // Cleanup any double wording
            finalName = finalName.replace("The The", "The");
            finalName = finalName.replace("Ol' The", "Ol'");

            if (finalName === "Ol' Dirty Bastard") {
                finalName = "Ol' Wu Bastard";
            }
        }

        return {
            name: finalName,
            isPoopVariant: isPoopVariant
        };
    }
});
