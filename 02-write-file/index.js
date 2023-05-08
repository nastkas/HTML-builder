const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'text.txt');

console.log('Введите текст или "exit" для выхода:');
process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    console.log('Завершение работы программы');
    process.exit();
  }

  fs.appendFile(filepath, input + '\n', (err) => { // текст в конец файла и создает его, если он еще не существует
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  console.log('\nЗавершение работы программы');
  process.exit();
});