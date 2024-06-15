DROP TABLE IF EXISTS Loans;
DROP TABLE IF EXISTS OrganizationCredits;
DROP TABLE IF EXISTS Borrowers;
DROP TABLE IF EXISTS Individuals;

CREATE TABLE Individuals (
    individual_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    passport VARCHAR(20) NOT NULL,
    inn VARCHAR(12) NOT NULL,
    snils VARCHAR(11) NOT NULL,
    drivers_license VARCHAR(20),
    extra_docs TEXT,
    note TEXT
);

CREATE TABLE Borrowers (
    borrower_id INT AUTO_INCREMENT PRIMARY KEY,
    inn VARCHAR(12) NOT NULL,
    is_individual INT NOT NULL,
    address VARCHAR(255),
    total_amount DECIMAL(15, 2),
    conditions TEXT,
    legal_notes TEXT,
    contract_list TEXT
);

CREATE TABLE Loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    individual_id INT,
    borrower_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    percent DECIMAL(5, 2) NOT NULL,
    rate INT NOT NULL,
    period INT NOT NULL,
    conditions TEXT,
    note TEXT,
    FOREIGN KEY (individual_id) REFERENCES Individuals(individual_id),
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id)
);

CREATE TABLE OrganizationCredits (
    credit_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    individual_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    period INT NOT NULL,
    percent DECIMAL(5, 2) NOT NULL,
    conditions TEXT,
    note TEXT,
    FOREIGN KEY (individual_id) REFERENCES Individuals(individual_id)
);

INSERT INTO Borrowers (inn, is_individual, address, total_amount, conditions, legal_notes, contract_list) 
VALUES 
('1234567890', 1, 'ул. Пушкина, д. 10, кв. 5', 15000.00, 'Безусловное согласие на займ', 'Нет особых условий', 'Договор №1'),
('9876543210', 0, 'ул. Лермонтова, д. 5', 25000.00, 'Ограничения на использование средств', 'Дополнительные выплаты при досрочном погашении', 'Договор №2'),
('1112223334', 1, 'пр. Гагарина, д. 15, кв. 20', 18000.00, 'Без учета кредитной истории', 'Рассмотрение заявки в течение 24 часов', 'Договор №3'),
('5556667778', 1, 'ул. Толстого, д. 7', 30000.00, 'Специальные условия для VIP-клиентов', 'Дополнительные бонусы при использовании банковских карт', 'Договор №4'),
('9998887776', 0, 'пр. Кирова, д. 30', 20000.00, 'Обязательные ежемесячные выплаты', 'Штрафные санкции за просрочку', 'Договор №5');

