ALTER TABLE `TurnHistory` CHANGE `GameID` `PlayerID` INT(11) NULL DEFAULT NULL;
ALTER TABLE `calculations`.`TurnHistory` DROP INDEX `GameID`, ADD INDEX `PlayerID` (`PlayerID`) USING BTREE;
ALTER TABLE `calculations`.`TurnHistory` DROP FOREIGN KEY `turnhistory_ibfk_1`; ALTER TABLE `turnhistory` ADD CONSTRAINT `turnhistory_ibfk_1` FOREIGN KEY (`PlayerID`) REFERENCES `players`(`PlayerID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `TurnHistory` CHANGE `Device` `Device` ENUM('desktop','mobile') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;