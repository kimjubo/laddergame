import { renameSync, writeFileSync } from "node:fs";
renameSync("dist-pages/pages.html", "dist-pages/index.html");
writeFileSync("dist-pages/.nojekyll", "");
