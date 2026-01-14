// download-textures.js
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Output folder
const outDir = './textures';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// List of materials / file names
const materials = [
          "Concrete",
          "Drywall",
          "DrywallWhite",
          "MetalDoor",
          "WhiteConcrete",
          "DarkBricks",
          "WoodFloor",
          "BlueWall",
          "BrickFloorOrange",
          "PlasterCracked",
          "SubwayTile",
          "Bamboo",
          "ConcreteTrim",
          "Grass",
          "Gravel",
          "ElectricalProps3",
          "ColoredMetal",
          "Luggage",
          "MetalDarkGray",
          "Asphalt",
          "ShopTrim",
          "JapaneseRoofTile",
          "JapaneseTrimSheet",
          "MetalRoof",
          "SubwayCeiling",
          "ApartmentProps",
          "NeonSignBase",
          "Marble",
          "Billboards",
          "FloorTile",
          "SubwayFloor",
          "WindowsDoors",
          "BluePanelWall",
          "BuildingAtlas",
          "",
          "Tarps",
          "ElectricalProps2",
          "ElectricalProps",
          "KeiTruck",
          "Tree",
          "OutdoorProps",
          "NONE/ERROR",
          "RoadTrim",
          "Glass",
          "NeonSignTrans",
          "StoneTrim",
          "Graffiti",
          "TrashDamage",
          "Fences",
          "EmissionScroll",
          "TarpsDynamic",
          "TarpsStatic",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "Puddle",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "Foliage",
          "TransTrim",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR",
          "NONE/ERROR"
];

// Extension — change to .webp, .jpg, or .png as used on server
const ext = '.webp';

// Base URL
const baseURL = 'https://deadshot.io/maps/neon/out/compressedTextures/';

async function downloadFile(url, filePath){
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`Saved ${filePath}`);
}

(async () => {
    for(const name of materials){
        const url = `${baseURL}${name}${ext}`;
        const filePath = path.join(outDir, `${name}${ext}`);
        try {
            await downloadFile(url, filePath);
        } catch(e){
            console.error(`Error downloading ${name}:`, e.message);
        }
    }
})();
