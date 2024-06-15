const mysql = require('mysql2/promise');
const http = require('http');
const fs = require('fs');
const qs = require('querystring');

// Подключение к базе данных
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '3003',
  database: 'lab1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Обработка параметров из формы
async function reqPost(request, response) {
    if (request.method === 'POST') {
        let body = '';

        request.on('data', function (data) {
            body += data;
        });

        request.on('end', async function () {
            const post = qs.parse(body);

            if (request.url === '/add') {
                const sInsert = "INSERT INTO Borrowers (inn, is_individual, address, total_amount, conditions, legal_notes, contract_list) VALUES (?, ?, ?, ?, ?, ?, ?)";
                
                try {
                    const [results] = await pool.execute(sInsert, [ post.inn,
                        post.is_individual, 
                        post.address,
                        post.total_amount,
                        post.conditions,
                        post.legal_notes,
                        post.contract_list]);
                    console.log('Запись успешно добавлена. ID:', results.insertId);
                    response.statusCode = 302; 
                    response.setHeader('Location', '/'); 
                    response.end();
                } catch (err) {
                    console.error('Ошибка выполнения запроса на добавление:', err);
                    response.statusCode = 500;
                    response.end('Ошибка сервера');
                }
            } else if (request.url === '/delete') {
                const sDelete = 'DELETE FROM Borrowers WHERE borrower_id = ?';
                try {
                    const [results] = await pool.execute(sDelete, [post.id]);
                    console.log('Done. Deleted ID:', post.id);
                    response.statusCode = 302; // Перенаправление после успешного удаления
                    response.setHeader('Location', '/'); // Перенаправление на главную страницу или другую страницу по желанию
                    response.end();
                } catch (err) {
                    console.error('Ошибка выполнения запроса на удаление:', err);
                    response.statusCode = 500;
                    response.end('Ошибка сервера');
                }
            } else {
                response.statusCode = 404;
                response.end('Ресурс не найден');
            }
        });
    } else {
        response.statusCode = 405;
        response.end('Метод не поддерживается');
    }
}

module.exports = reqPost;

// Выгрузка массива данных
async function ViewSelect(res) {
    try {
        const [columns] = await pool.query('SHOW COLUMNS FROM Borrowers');
        res.write('<tr>');
        for (let column of columns) {
            res.write('<th>' + column.Field + '</th>');
        }
        res.write('</tr>');

        const [rows] = await pool.query('SELECT * FROM Borrowers');
        for (let row of rows) {
            res.write('<tr>');
            for (let column in row) {
                res.write('<td>' + row[column] + '</td>');
            }
            res.write('</tr>');
        }
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
    }
}

// Версия базы данных
async function ViewVer(res) {
    try {
        const [rows] = await pool.query('SELECT VERSION() AS ver');
        res.write(rows[0].ver);
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
    }
}

// Создание HTTP-сервера
const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        await reqPost(req, res); // Обработка POST-запросов
    } else if (req.method === 'GET') {
        console.log('Loading...');

        res.statusCode = 200;

        // Чтение шаблона HTML
        const array = fs.readFileSync(__dirname + '/select.html').toString().split('\n');
        for (let i in array) {
            // Подстановка данных в шаблон
            if (array[i].trim() !== '@tr' && array[i].trim() !== '@ver') res.write(array[i]);
            if (array[i].trim() === '@tr') await ViewSelect(res); // Вставка данных таблицы
            if (array[i].trim() === '@ver') await ViewVer(res); // Вставка версии базы данных
        }
        res.end();
        console.log('User Done.');
    }
});

// Запуск сервера
const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});