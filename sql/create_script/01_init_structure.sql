-- Table for players
CREATE TABLE Players (
    PlayerID INT AUTO_INCREMENT PRIMARY KEY, -- Unique player ID
    Name VARCHAR(100),                       -- Player's name
    Username VARCHAR(100) NOT NULL UNIQUE,   -- Username (required)
    PasswordHash VARCHAR(255) NOT NULL,      -- Hashed password (required)
    Age INT,                                 -- Player's age
    ClassNumber INT                          -- Current class number
);

-- Table for levels
CREATE TABLE Levels (
    LevelID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique level ID
    Type VARCHAR(50),                        -- Type of level (e.g., additionSubtraction)
    Name VARCHAR(20),                        -- Name of level
    MinA INT,                                -- Minimum value of operand A
    MaxA INT,                                -- Maximum value of operand A
    Operator VARCHAR(2),                     -- Operators allowed (+, -, +-)
    MinB INT,                                -- Minimum value of operand B
    MaxB INT,                                -- Maximum value of operand B
    MinResult INT,                           -- Minimum result
    MaxResult INT,                           -- Maximum result
    Description TEXT                         -- Description of the level
);

-- Table for images
CREATE TABLE PlayerImages (
    ImageID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique image ID
    PlayerID INT,                            -- Associated player
    UploadDate DATETIME,                     -- Date of image upload
    ImageURL TEXT,                           -- URL of the image
    LastUsedDate DATETIME,                   -- Last time the image was used
    RevealPercentage DECIMAL(5, 2) DEFAULT 0.00, -- Percentage of image revealed (0-100%)
    UsageCount INT DEFAULT 0,                -- Number of times image has been used
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID)
);

-- Table for game history (for incomplete games)
CREATE TABLE GameHistory (
    GameID INT AUTO_INCREMENT PRIMARY KEY,   -- Unique game ID
    CreationTimestamp DATETIME,              -- Timestamp when the game was created
    PlayerID INT,                            -- Player associated with the game
    CurrentTurn VARCHAR(50),                 -- Current turn (player or opponent)
    LivesPlayer INT,                         -- Lives left for the player
    LivesOpponent INT,                       -- Lives left for the opponent
    TimeLimitSeconds INT,                    -- Set time for the game
    CurrentLevelID INT,                      -- Current level ID
    LastExpression VARCHAR(255),             -- Last expression (e.g., "5 + 3")
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID),
    FOREIGN KEY (CurrentLevelID) REFERENCES Levels(LevelID)
);

-- Table for turn history (used for incomplete games)
CREATE TABLE TurnHistory (
    TurnID INT AUTO_INCREMENT PRIMARY KEY,   -- Unique turn ID
    GameID INT,                              -- Associated game
    OperandA INT,                            -- Operand A
    Operator VARCHAR(2),                     -- Operator (+, -)
    OperandB INT,                            -- Operand B
    CorrectAnswer INT,                       -- Correct result
    PlayerAnswer INT,                        -- Player's answer
    IsCorrect BOOLEAN,                       -- Whether the answer was correct
    AnswerTimeMs INT,                        -- Time taken to answer (ms)
    FOREIGN KEY (GameID) REFERENCES GameHistory(GameID)
);

-- Table for used examples
CREATE TABLE UsedExamples (
    ExampleID INT AUTO_INCREMENT PRIMARY KEY, -- Unique example ID
    OperandA INT,                             -- Operand A
    Operator VARCHAR(2),                      -- Operator (+, -)
    OperandB INT,                             -- Operand B
    CorrectAnswer INT                         -- Correct answer
);

-- Table for example statistics
CREATE TABLE ExampleStats (
    StatID INT AUTO_INCREMENT PRIMARY KEY,   -- Unique stat ID
    PlayerID INT,                            -- Player ID
    ExampleID INT,                           -- Example ID (from UsedExamples)
    BestTimeMs INT,                          -- Best answer time (ms)
    WorstTimeMs INT,                         -- Worst answer time (ms)
    ErrorRate DECIMAL(5, 2),                 -- Error rate percentage
    TotalAttempts INT,                       -- Total attempts for this example
    CorrectAttempts INT,                     -- Total correct attempts
    IncorrectAttempts INT,                   -- Total incorrect attempts
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID),
    FOREIGN KEY (ExampleID) REFERENCES UsedExamples(ExampleID)
);

-- Table for incorrect answers history
CREATE TABLE IncorrectAnswers (
    ErrorID INT AUTO_INCREMENT PRIMARY KEY,   -- Unique error ID
    PlayerID INT,                             -- Associated player
    OperandA INT,                             -- Operand A
    Operator VARCHAR(2),                      -- Operator (+, -)
    OperandB INT,                             -- Operand B
    CorrectAnswer INT,                        -- Correct answer
    PlayerAnswer INT,                         -- Player's incorrect answer
    AnswerTimeMs INT,                         -- Time taken to answer (ms)
    LevelID INT,                              -- Level from which the example came
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID),
    FOREIGN KEY (LevelID) REFERENCES Levels(LevelID)
);
