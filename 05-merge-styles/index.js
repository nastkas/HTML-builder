const fs = require('fs').promises;
const path = require('path');

const stylesDir = './05-merge-styles/styles';
const outputDir = './05-merge-styles/project-dist';
const outputFile = 'bundle.css';

async function mergeStyles() {
  try {
    // Создаем папку project-dist, если она не существует
    await fs.mkdir(outputDir, { recursive: true });

    // Получаем список файлов в директории styles
    const files = await fs.readdir(stylesDir);

    // Отбираем только CSS-файлы
    const cssFiles = files.filter(file => path.extname(file) === '.css');

    // Объединяем содержимое CSS-файлов
    const cssContent = (await Promise.all(cssFiles.map(file =>
      fs.readFile(path.join(stylesDir, file), 'utf-8')
    ))).join('\n');

    // Записываем объединенный CSS-код в файл bundle.css
    await fs.writeFile(path.join(outputDir, outputFile), cssContent);

    console.log('Styles merged successfully!');
  } catch (error) {
    console.error(`Error merging styles: ${error}`);
  }
}

mergeStyles();

