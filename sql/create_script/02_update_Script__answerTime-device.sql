-- Změna názvu sloupce v tabulce TurnHistory
ALTER TABLE TurnHistory
    CHANGE COLUMN AnswerTimeMs AnswerTimeFirstMs INT,
    ADD COLUMN AnswerTimeTotalMs INT;

-- Přidání sloupce Device do tabulek GameHistory, TurnHistory, CalculatingStats, IncorrectAnswers
ALTER TABLE GameHistory
    ADD COLUMN Device ENUM('desktop', 'mobile');

ALTER TABLE TurnHistory
    ADD COLUMN Device ENUM('desktop', 'mobile');

ALTER TABLE CalculatingStats
    ADD COLUMN Device ENUM('desktop', 'mobile');

ALTER TABLE IncorrectAnswers
    ADD COLUMN Device ENUM('desktop', 'mobile');