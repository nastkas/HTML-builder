const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const source = './04-copy-directory/files';
  const destination = './04-copy-directory/files-copy';

  // Проверяем, существует ли папка files-copy
  try {
    await fs.access(destination);
  } catch (error) {
    // Если папки нет, создаем ее
    await fs.mkdir(destination, { recursive: true });
  }

  // Читаем содержимое папки files
  const sourceFiles = await fs.readdir(source);
  const destinationFiles = await fs.readdir(destination);

  // Копируем файлы из папки files в папку files-copy
  for (const file of sourceFiles) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const fileStat = await fs.stat(sourcePath);

    if (fileStat.isDirectory()) {
      // Если это директория, рекурсивно копируем содержимое
      await copyDir(sourcePath, destinationPath);
    } else {
      // Если это файл, копируем его
      await fs.copyFile(sourcePath, destinationPath);
    }
  }

  // Удаляем файлы из целевой папки, которых нет в исходной папке
  for (const file of destinationFiles) {
    if (!sourceFiles.includes(file)) {
      const filePath = path.join(destination, file);
      await fs.unlink(filePath);
    }
  }
}

copyDir().catch(console.error);

