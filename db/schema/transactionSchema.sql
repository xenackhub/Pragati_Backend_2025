DROP TABLE IF EXISTS `sample_table`;
CREATE TABLE `sample_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
INSERT INTO `sample_table` (`name`)
VALUES ('sample1');
INSERT INTO `sample_table` (`name`)
VALUES ('sample2');