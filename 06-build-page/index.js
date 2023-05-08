const fs = require('fs').promises;
const path = require('path');

async function buildPage() {
  const distDir = path.join(__dirname,'project-dist');
  const stylesDir = path.join(__dirname,'styles');
  const componentsDir = path.join(__dirname, 'components');

  // создание папки project-dist
  await fs.mkdir(distDir, { recursive: true });

  // чтение содержимого папок styles и components
  const [styles, components] = await Promise.all([
    fs.readdir(stylesDir),
    fs.readdir(componentsDir),
  ]);

  // чтение содержимого файла template.html
  let dirTemplate = path.join(__dirname, 'template.html');
  let html = await fs.readFile(dirTemplate, 'utf-8', { withFileTypes: true });

  const templates = html.match(/{{\w*}}/g).map(item => item.replace(/[{}]/g, ''));
  for (let template of templates) {
    const filePath = path.join(componentsDir, `${template}.html`);
    const htmlTemplate = await fs.readFile(filePath, 'utf-8');
    const htmlRegExp = new RegExp(`{{${template}}}`);
    html = html.replace(htmlRegExp, htmlTemplate);
  }

  try {
    await fs.writeFile(path.join(distDir, 'index.html'), html);
  } catch (error) {
    console.error(error);
  }

  // чтение содержимого файлов стилей
  const styleContents = await Promise.all(
    styles.map((name) => fs.readFile(path.join(stylesDir, name), 'utf-8'))
  );

  // запись содержимого файла style.css
  await fs.writeFile(path.join(distDir, 'style.css'), styleContents.join('\n'));

  // копирование папки assets
  async function copyDir(source, destination) {
    // Проверяем, существует ли папка assets
    try {
      await fs.access(destination);
    } catch (error) {
      // Если папки нет, создаем ее
      await fs.mkdir(destination, { recursive: true });
    }
  
    // Читаем содержимое папки assets
    const sourceFiles = await fs.readdir(source);
    const destinationFiles = await fs.readdir(destination);
  
    // Копируем файлы из папки assets в папку assets
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
  // копирование папки assets
  const assetsSource = path.join(__dirname, 'assets');
  const assetsDestination = path.join(__dirname, 'project-dist', 'assets');
  await copyDir(assetsSource, assetsDestination);
}
buildPage().catch((error) => console.error(error));
