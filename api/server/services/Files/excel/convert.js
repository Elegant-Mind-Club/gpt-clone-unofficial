// UCLA BEGIN EDIT

const path = require('path');
const fs = require('fs');

async function convertToExcel(req, file) {
  const inputFilePath = file.path;
  const extension = path.extname(inputFilePath);

  const { imageOutput } = req.app.locals.config; // temporary workaround. should be excelOutput, but that doesn't exist in req.app.locals.config. Fix later
  const userPath = path.join(imageOutput, req.user.id);

  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true });
  }

  const newPath = path.join(userPath, path.basename(inputFilePath));
  const outputFilePath = newPath.replace(extension, '.xlsx');

  await fs.promises.copyFile(inputFilePath, outputFilePath);
  const bytes = (await fs.promises.stat(outputFilePath)).size;
  const filepath = path.posix.join('/', 'images', req.user.id, path.basename(outputFilePath));
  await fs.promises.unlink(inputFilePath);
  return { filepath, bytes };
}

module.exports = { convertToExcel };

// UCLA END EDIT
