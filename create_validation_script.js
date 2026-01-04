// Validation script for scenes_data.ts
// Since scenes_data.ts is typescript, we'll strip types or just use a simple regex/parser approach
// or simpler: we can just copy the data structure to a temporary js file and run it.

// Actually, I can read the file, strip the TS interfaces, change 'export const' to 'const', and append the validation logic.

const fs = require("fs");
const path = require("path");

const filePath =
  "/Users/youren/Desktop/Project/Braving_Aotai_Trail/utils/game/scenes_data.ts";
let content = fs.readFileSync(filePath, "utf-8");

// Strip imports if any (though I didn't see any)
content = content.replace(/^import .*$/gm, "");

// Strip interfaces
content = content.replace(/export interface [\s\S]*?}/g, "");
// Strip specific interface usages if any, like ': Record<string, Scene>'
content = content.replace(/: SceneChoice\[\]/g, "");
content = content.replace(/: Scene/g, "");
content = content.replace(/: Record<string, Scene>/g, "");
content = content.replace(/: Record<string, string>/g, "");
content = content.replace(/: string/g, "");
content = content.replace(/: number/g, "");
content = content.replace(/: boolean/g, "");
content = content.replace(/: ChoiceCost/g, "");
// Remove 'export'
content = content.replace(/export /g, "");

// Append validation logic
const validationLogic = `
console.log("Starting Validation...");
let errorCount = 0;

const allSceneIds = new Set(Object.keys(scenes));

// Check randomEventIds
randomEventIds.forEach(id => {
    if (!scenes[id]) {
        console.error("Error: Random event ID not found: " + id);
        errorCount++;
    }
});

// Check choices
Object.values(scenes).forEach(scene => {
    if (!scene.choices) {
        // Some endings might not have choices? No, usually they have restart.
        // But end_game_cleared we suspected.
        console.warn("Warning: Scene has no choices: " + scene.id);
        if (!scene.id.startsWith('end_') && !scene.id.startsWith('dead_')) {
             console.error("Error: Non-ending scene has no choices: " + scene.id);
             errorCount++;
        }
        return;
    }

    scene.choices.forEach((choice, index) => {
        // Must have target OR action
        if (!choice.target && !choice.action) {
            console.error(\`Error: Scene '\${scene.id}' choice \${index} ('\${choice.text}') has no target and no action.\`);
            errorCount++;
        }

        if (choice.target) {
            if (choice.target === 'resume') {
                // Valid for events
            } else if (choice.target.startsWith('node_') || choice.target.startsWith('evt_') || choice.target.startsWith('end_') || choice.target.startsWith('dead_') || choice.target === 'start_001') {
                 if (!scenes[choice.target]) {
                     console.error(\`Error: Scene '\${scene.id}' choice \${index} targets missing scene: '\${choice.target}'\`);
                     errorCount++;
                 }
            } else {
                 // Unknown format
                 console.warn(\`Warning: Scene '\${scene.id}' choice \${index} has unusual target: '\${choice.target}'\`);
                 if (!scenes[choice.target]) {
                     console.error(\`Error: Target not found: \${choice.target}\`);
                     errorCount++;
                 }
            }
        }
    });
});

console.log(\`Validation complete. Found \${errorCount} errors.\`);
`;

const tempFile =
  "/Users/youren/Desktop/Project/Braving_Aotai_Trail/verify_scenes_temp.js";
fs.writeFileSync(tempFile, content + validationLogic);
console.log("Created temp validation file at " + tempFile);
