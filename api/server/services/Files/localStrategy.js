const { createFile } = require('~/models');
const { convertToWebP } = require('./images/convert');
const { convertToExcel } = require('./excel/convert');

/**
 * Applies the local strategy for image uploads.
 * Saves file metadata to the database with an expiry TTL.
 * Files must be deleted from the server filesystem manually.
 *
 * @param {Object} params - The parameters object.
 * @param {Express.Request} params.req - The Express request object.
 * @param {Express.Response} params.res - The Express response object.
 * @param {Express.Multer.File} params.file - The uploaded file.
 * @param {ImageMetadata} params.metadata - Additional metadata for the file.
 * @returns {Promise<void>}
 */
const localStrategy = async ({ req, res, file, metadata }) => {
  const { file_id, temp_file_id } = metadata;
  const { filepath, bytes, width, height } = await convertToWebP(req, file);
  const result = await createFile(
    {
      user: req.user.id,
      file_id,
      temp_file_id,
      bytes,
      filepath,
      filename: file.originalname,
      type: 'image/webp',
      width,
      height,
    },
    true,
  );
  res.status(200).json({ message: 'File uploaded and processed successfully', ...result });
};

// UCLA BEGIN EDIT
// Local strategy for excel files

/**
 * Applies the local strategy for excel uploads.
 * Saves file metadata to the database with an expiry TTL.
 * Files must be deleted from the server filesystem manually.
 *
 * @param {Object} params - The parameters object.
 * @param {Express.Request} params.req - The Express request object.
 * @param {Express.Response} params.res - The Express response object.
 * @param {Express.Multer.File} params.file - The uploaded file.
 * @param {ExcelMetadata} params.metadata - Additional metadata for the file.
 * @returns {Promise<void>}
 */
const localStrategyExcel = async ({ req, res, file, metadata }) => {
  const { file_id, temp_file_id } = metadata;
  const { filepath, bytes } = await convertToExcel(req, file);
  const result = await createFile(
    {
      user: req.user.id,
      file_id,
      temp_file_id,
      bytes,
      filepath,
      filename: file.originalname,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type for Excel files
      // Additional Excel-specific metadata can be added here
    },
    true,
  );
  res.status(200).json({ message: 'File uploaded and processed successfully', ...result });
};

// UCLA END EDIT

// UCLA BEGIN EDIT
// export localStrategyExcel too

// module.exports = localStrategy;
module.exports = { localStrategy, localStrategyExcel };

// UCLA END EDIT
