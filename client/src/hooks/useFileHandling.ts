import { v4 } from 'uuid';
import debounce from 'lodash/debounce';
import { useState, useEffect, useCallback } from 'react';
import type { ExtendedFile } from '~/common';
import { useToastContext } from '~/Providers/ToastContext';
import { useChatContext } from '~/Providers/ChatContext';
import { useUploadImageMutation } from '~/data-provider';
import { useUploadExcelMutation } from '~/data-provider';
import useSetFilesToDelete from './useSetFilesToDelete';
import { NotificationSeverity } from '~/common';
// UCLA EDIT BEGIN
// Excel icon for the frontend display of excel files
import excelIcon from '../../public/assets/excel-icon.png';
// UCLA EDIT END

const sizeMB = 20;
const maxSize = 25;
const fileLimit = 10;
const sizeLimit = sizeMB * 1024 * 1024; // 20 MB
const totalSizeLimit = maxSize * 1024 * 1024; // 25 MB

// UCLA BEGIN EDIT
// Add excel files to supportedTypes
// const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const supportedTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
// Add a list of supported excel types for checking types later
const supportedExcelTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
// UCLA END EDIT

const useFileHandling = () => {
  const { showToast } = useToastContext();
  const [errors, setErrors] = useState<string[]>([]);
  const setError = (error: string) => setErrors((prevErrors) => [...prevErrors, error]);
  const { files, setFiles, setFilesLoading } = useChatContext();
  const setFilesToDelete = useSetFilesToDelete();

  const displayToast = useCallback(() => {
    if (errors.length > 1) {
      const errorList = Array.from(new Set(errors))
        .map((e, i) => `${i > 0 ? '• ' : ''}${e}\n`)
        .join('');
      showToast({
        message: errorList,
        severity: NotificationSeverity.ERROR,
        duration: 5000,
      });
    } else if (errors.length === 1) {
      showToast({
        message: errors[0],
        severity: NotificationSeverity.ERROR,
        duration: 5000,
      });
    }

    setErrors([]);
  }, [errors, showToast]);

  const debouncedDisplayToast = debounce(displayToast, 250);

  useEffect(() => {
    if (errors.length > 0) {
      debouncedDisplayToast();
    }

    return () => debouncedDisplayToast.cancel();
  }, [errors, debouncedDisplayToast]);

  const addFile = (newFile: ExtendedFile) => {
    setFiles((currentFiles) => {
      const updatedFiles = new Map(currentFiles);
      updatedFiles.set(newFile.file_id, newFile);
      return updatedFiles;
    });
  };

  const replaceFile = (newFile: ExtendedFile) => {
    setFiles((currentFiles) => {
      const updatedFiles = new Map(currentFiles);
      updatedFiles.set(newFile.file_id, newFile);
      return updatedFiles;
    });
  };

  const updateFileById = (fileId: string, updates: Partial<ExtendedFile>) => {
    setFiles((currentFiles) => {
      if (!currentFiles.has(fileId)) {
        console.warn(`File with id ${fileId} not found.`);
        return currentFiles;
      }

      const updatedFiles = new Map(currentFiles);
      const currentFile = updatedFiles.get(fileId);
      if (!currentFile) {
        console.warn(`File with id ${fileId} not found.`);
        return currentFiles;
      }
      updatedFiles.set(fileId, { ...currentFile, ...updates });

      if (updates['filepath'] && updates['progress'] !== 1) {
        const files = Object.fromEntries(updatedFiles);
        setFilesToDelete(files);
      }

      return updatedFiles;
    });
  };

  const deleteFileById = (fileId: string) => {
    setFiles((currentFiles) => {
      const updatedFiles = new Map(currentFiles);
      if (updatedFiles.has(fileId)) {
        updatedFiles.delete(fileId);
      } else {
        console.warn(`File with id ${fileId} not found.`);
      }

      const files = Object.fromEntries(updatedFiles);
      setFilesToDelete(files);
      return updatedFiles;
    });
  };

  const uploadImage = useUploadImageMutation({
    onSuccess: (data) => {
      console.log('upload success', data);
      updateFileById(data.temp_file_id, {
        progress: 0.9,
        filepath: data.filepath,
      });

      setTimeout(() => {
        updateFileById(data.temp_file_id, {
          progress: 1,
          file_id: data.file_id,
          temp_file_id: data.temp_file_id,
          filepath: data.filepath,
          type: data.type,
          height: data.height,
          width: data.width,
          filename: data.filename,
        });
      }, 300);
    },
    onError: (error, body) => {
      console.log('upload error', error);
      deleteFileById(body.file_id);
      setError('An error occurred while uploading the file.');
    },
  });

  // UCLA BEGIN EDIT
  // Add ability to upload excel files
  const uploadExcel = useUploadExcelMutation({
    onSuccess: (data) => {
      console.log('upload success', data);
      updateFileById(data.temp_file_id, {
        progress: 0.9,
        filepath: data.filepath,
      });

      setTimeout(() => {
        updateFileById(data.temp_file_id, {
          progress: 1,
          file_id: data.file_id,
          temp_file_id: data.temp_file_id,
          filepath: data.filepath,
          type: data.type,
          filename: data.filename,
        });
      }, 300);
    },
    onError: (error, body) => {
      console.log('upload error', error);
      deleteFileById(body.file_id);
      setError('An error occurred while uploading the file.');
    },
  });
  // UCLA END EDIT

  const uploadFile = async (extendedFile: ExtendedFile) => {
    const formData = new FormData();
    formData.append('file', extendedFile.file);
    formData.append('file_id', extendedFile.file_id);
    if (extendedFile.width) {
      formData.append('width', extendedFile.width?.toString());
    }
    if (extendedFile.height) {
      formData.append('height', extendedFile.height?.toString());
    }
    // UCLA BEGIN EDIT
    // Change the if statement to check if the file is an excel file

    // uploadImage.mutate({ formData, file_id: extendedFile.file_id });

    if (supportedExcelTypes.includes(extendedFile.file.type)) {
      // If the file is an excel file, then upload it as an excel file
      uploadExcel.mutate({ formData, file_id: extendedFile.file_id });
    } else {
      // If the file is not an excel file, then upload it as an image
      uploadImage.mutate({ formData, file_id: extendedFile.file_id });
    }
    // UCLA END EDIT
  };

  const validateFiles = (fileList: File[]) => {
    const existingFiles = Array.from(files.values());
    const incomingTotalSize = fileList.reduce((total, file) => total + file.size, 0);
    const currentTotalSize = existingFiles.reduce((total, file) => total + file.size, 0);

    if (fileList.length + files.size > fileLimit) {
      setError(`You can only upload up to ${fileLimit} files at a time.`);
      return false;
    }

    for (let i = 0; i < fileList.length; i++) {
      const originalFile = fileList[i];
      if (!supportedTypes.includes(originalFile.type)) {
        // UCLA BEGIN EDIT
        // Change error message to include excel files too
        // setError('Currently, only JPEG, JPG, PNG, and WEBP files are supported.');
        setError('Currently, only JPEG, JPG, PNG, WEBP, and excel files are supported.');
        // UCLA END EDIT
        return false;
      }

      if (originalFile.size >= sizeLimit) {
        setError(`File size exceeds ${sizeMB} MB.`);
        return false;
      }
    }

    if (currentTotalSize + incomingTotalSize > totalSizeLimit) {
      setError(`The total size of the files cannot exceed ${maxSize} MB.`);
      return false;
    }

    const combinedFilesInfo = [
      ...existingFiles.map(
        (file) => `${file.file.name}-${file.size}-${file.type?.split('/')[0] ?? 'file'}`,
      ),
      ...fileList.map((file) => `${file.name}-${file.size}-${file.type?.split('/')[0] ?? 'file'}`),
    ];

    const uniqueFilesSet = new Set(combinedFilesInfo);

    if (uniqueFilesSet.size !== combinedFilesInfo.length) {
      setError('Duplicate file detected.');
      return false;
    }

    return true;
  };

  const handleFiles = async (_files: FileList | File[]) => {
    const fileList = Array.from(_files);
    /* Validate files */
    let filesAreValid: boolean;
    try {
      filesAreValid = validateFiles(fileList);
    } catch (error) {
      console.error('file validation error', error);
      setError('An error occurred while validating the file.');
      return;
    }
    if (!filesAreValid) {
      setFilesLoading(false);
      return;
    }

    /* Process files */

    // UCLA BEGIN EDIT
    // Change the for each function to async so that the excel await function works
    // fileList.forEach((originalFile) => {
    for (const originalFile of fileList) {
      // UCLA END EDIT
      const file_id = v4();
      try {
        const preview = URL.createObjectURL(originalFile);
        let extendedFile: ExtendedFile = {
          file_id,
          file: originalFile,
          preview,
          progress: 0.2,
          size: originalFile.size,
        };

        addFile(extendedFile);

        // UCLA BEGIN EDIT

        // Add a check for excel files. If the file is an excel file, then upload it and skip the rest of the code

        if (supportedExcelTypes.includes(originalFile.type)) {
          // Handle Excel files
          extendedFile = {
            ...extendedFile,
            preview: excelIcon, // Set preview to Excel icon
            progress: 0.6,
          };
          replaceFile(extendedFile);

          await uploadFile(extendedFile);
          URL.revokeObjectURL(preview);
          continue;
        }

        // UCLA END EDIT

        // async processing
        const img = new Image();
        img.onload = async () => {
          extendedFile.width = img.width;
          extendedFile.height = img.height;
          extendedFile = {
            ...extendedFile,
            progress: 0.6,
          };
          replaceFile(extendedFile);

          await uploadFile(extendedFile);
          URL.revokeObjectURL(preview);
        };
        img.src = preview;
      } catch (error) {
        deleteFileById(file_id);
        console.log('file handling error', error);
        setError('An error occurred while processing the file.');
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.target.files) {
      setFilesLoading(true);
      handleFiles(event.target.files);
      // reset the input
      event.target.value = '';
    }
  };

  return {
    handleFileChange,
    handleFiles,
    files,
    setFiles,
  };
};

export default useFileHandling;
