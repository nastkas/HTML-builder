const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {  //получить имена всех файлов находящихся в заданной директории.
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {   // информация о файле, включая его размер в байтах.
      if (err) {
        console.error(err);
        return;
      }

      if (stats.isFile()) {  // проверка на директорий
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const fileExtension = path.extname(file); //расширение файла 
        const fileName = path.basename(file, fileExtension); //имя файл
        console.log(`${fileName}-${fileExtension}-${fileSizeInKB.toFixed(3)}kb`);
      }
    });
  });
});