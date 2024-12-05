/*
  ===========================================================================
  Database Schema Overview
  ===========================================================================
  Purpose:
    This schema defines the structure for the Pragati database.
    It is designed to manage and store user information, roles, events, 
    registration details and other related data for the application. 
    The schema facilitates efficient data handling, role-based access control,
    and activity tracking.

  Key Features:
    - Normalized structure to minimize redundancy and optimize queries.
    - Foreign key constraints to ensure data integrity and enforce relationships.
    - Default values and constraints for consistent and valid data entry.
    - Support for transactional operations using the InnoDB engine.

  Engine and Encoding:
    - Engine: 
      1. InnoDB is used for all tables except one to support transactions and foreign keys.
      2. MEMORY is used for otpTable for temporary storage of data and faster access.
    - Charset: utf8mb4 for wide Unicode compatibility (e.g., emojis, special characters).

  Notes:
    - Ensure proper indexing of frequently queried columns to optimize performance.
    - Backup and replication strategies should be implemented for data safety.
  ===========================================================================
*/

DROP TABLE IF EXISTS `registrationData`;
DROP TABLE IF EXISTS `accommodationData`;
DROP TABLE IF EXISTS `groupEventTeamSizeData`;
DROP TABLE IF EXISTS `groupDetail`;
DROP TABLE IF EXISTS `userData`;
DROP TABLE IF EXISTS `otpTable`;
DROP TABLE IF EXISTS `userRole`;
DROP TABLE IF EXISTS `organizerEventMapping`;
DROP TABLE IF EXISTS `tagEventMapping`;
DROP TABLE IF EXISTS `clubEventMapping`;
DROP TABLE IF EXISTS `eventData`;
DROP TABLE IF EXISTS `organizerData`;
DROP TABLE IF EXISTS `tagData`;
DROP TABLE IF EXISTS `clubData`;
DROP TABLE IF EXISTS `presenterData`;

-- table for user role ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userRole` (
    `roleID` INT AUTO_INCREMENT PRIMARY KEY,
    `roleName` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table for user data -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userData` (
  `userID` INT AUTO_INCREMENT PRIMARY KEY,
  `userEmail` VARCHAR(255) UNIQUE NOT NULL, 
  `userPassword` VARCHAR(255) NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `rollNumber` VARCHAR(50) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `roleID` INT,
  `collegeName` VARCHAR(255) NOT NULL, 
  `collegeCity` VARCHAR(255) NOT NULL,
  `userDepartment` VARCHAR(255) NOT NULL,
  `academicYear` INT NOT NULL,
  `degree` VARCHAR(100) NOT NULL,
  `needAccommodation` BOOL DEFAULT FALSE,
  `emailType` BOOL DEFAULT TRUE NOT NULL,   -- Represents if email is amrita mail or individual mail
  `accountStatus` CHAR(1) NOT NULL CHECK(`accountStatus` IN ('-1','0','1')),  -- '-1':Blocked  '0':Not verified  '1':Verified
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`roleID`) REFERENCES `userRole` (`roleID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for group information ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `groupDetail` (
  `groupID` INT AUTO_INCREMENT PRIMARY KEY,
  `leaderID` INT,
  `groupName` VARCHAR(255) NOT NULL,
  `numOfMembers` INT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`leaderID`) REFERENCES `userData` (`userID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for temporary otp storage (Engine:in-memory storage) -----------------------------------------

CREATE TABLE IF NOT EXISTS `otpTable` (
  `userID` INT NOT NULL,
  `otp` CHAR(4),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES `userData` (`userID`) ON DELETE CASCADE
) ENGINE=MEMORY DEFAULT CHARSET=utf8mb4;


-- table for event presenter's details -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `presenterData` (
  `presenterID` INT AUTO_INCREMENT PRIMARY KEY,
  `presenterName` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(15),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for event data --------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `eventData` (
  `eventID` INT AUTO_INCREMENT PRIMARY KEY,
  `eventName` VARCHAR(255) NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  `eventFee` INT NOT NULL,
  `eventDescription` TEXT NOT NULL,
  `eventDescSmall` TEXT,
  `presenterID` INT,
  `isGroup` BOOL DEFAULT FALSE,
  `eventDate` CHAR(1) NOT NULL CHECK(`eventDate` IN ('1','2','3')),  -- the day of the events, so that the original date can be changed
  `eventStatus` CHAR(1) DEFAULT '1' CHECK(`eventStatus` IN ('0','1','2')), -- Blocked, Open, Full
  `numRegistrations` INT DEFAULT 0,
  `maxRegistrations` INT NOT NULL,
  `isPerHeadFee` BOOL DEFAULT FALSE,
  `godName` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`presenterID`) REFERENCES `presenterData` (`presenterID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- table for storing the size of team allowed for group events ------------------------------------

CREATE TABLE IF NOT EXISTS `groupEventTeamSizeData` (
  `eventID` INT NOT NULL,
  `minTeamSize` INT NOT NULL,
  `maxTeamSize` INT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for registration details ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `registrationData` (
  `registrationID` INT AUTO_INCREMENT PRIMARY KEY,
  `eventID` INT,
  `transactionID` INT NOT NULL,
  `groupID` INT,
  `userID` INT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (`groupID`) REFERENCES `groupDetail` (`groupID`) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES `userData` (`userID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for event organizer details  -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `organizerData` (
  `organizerID` INT AUTO_INCREMENT PRIMARY KEY,
  `organizerName` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for mapping many-to-many relation between eventData and organizerData --------------------------

CREATE TABLE IF NOT EXISTS `organizerEventMapping` (
  `organizerID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`organizerID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`organizerID`) REFERENCES `organizerData` (`organizerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for tag data -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tagData` (
  `tagID` INT AUTO_INCREMENT PRIMARY KEY,
  `tagName` VARCHAR(255) NOT NULL,
  `tagAbbrevation` VARCHAR(10) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for mapping many-to-many relation between tagData and eventData --------------------------------

CREATE TABLE IF NOT EXISTS `tagEventMapping` (
  `tagID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`tagID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`tagID`) REFERENCES `tagData` (`tagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for club data ------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `clubData` (
  `clubID` INT AUTO_INCREMENT PRIMARY KEY,
  `clubName` VARCHAR(255) NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  `clubHead` VARCHAR(255),
  `clubAbbrevation` VARCHAR(50),
  `godName` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for mapping many-to-many relation between clubData and eventData ---------------------------------

CREATE TABLE IF NOT EXISTS `clubEventMapping` (
  `clubID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`clubID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`clubID`) REFERENCES `clubData` (`clubID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- table for accommodation details ------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `accommodationData` (
  `userID` INT PRIMARY KEY,
  `firstDay` BOOL,
  `secondDay` BOOL,
  `thirdDay` BOOL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES `userData` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
