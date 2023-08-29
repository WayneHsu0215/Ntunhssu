USE master
-- 檢查資料庫是否存在
IF DB_ID('NTUNHS') IS NOT NULL
    DROP DATABASE NTUNHS;
GO

-- 新建資料庫
CREATE DATABASE NTUNHS
    COLLATE Chinese_PRC_CI_AS;
GO

-- 新建資料表
USE NTUNHS;




CREATE TABLE Account
(
    ID int identity(1,1) PRIMARY KEY,
    AccID varchar(10) UNIQUE,
    Password varchar(100),
    Balance int,
    BranchID int,
    AccType varchar(3),
    UP_Date datetime,
    UP_User varchar(20)
);
DECLARE @CURRENT_TS datetimeoffset = GETDATE();
INSERT INTO ACCOUNT
( AccID, Password, Balance, BranchID, AccType, UP_Date, UP_User)
VALUES
    ( 'ntunhssu', 'ntunhssuu', 5000, 10, 'B01', @CURRENT_TS, '0');
GO

select * from Account;

CREATE TABLE Reply
(
    ID int PRIMARY KEY identity(1,1),
    Class varchar(10),
    StudentID varchar(10),
    Gender varchar(10),
    Name varchar(40),
    Content varchar(max),
    UP_Date datetime  DEFAULT GETDATE()  ,
    UP_User int
);
GO

INSERT INTO Reply
( Class, StudentID, Gender,Name, Content, UP_User)
VALUES
    ( '資四二B', '001','男性', 'LJ KUO', '測試中許願區', 1),
    ( '資四二A', '002','男性', 'CW Lin', '歡迎來到北護！', 0),
    ( '健四三B', '003','女性', 'DW Wang', '歡迎新同學，一起學習成長！', 0),
    ( '護二五C', '004','女性', 'YY Chen', '歡迎加入我們的大家庭，一同創造美好回憶！', 0),
    ( '護四一D', '005','男性', 'JH Wu', '迎接學習的新挑戰，讓我們一起成長！', 0),
    ( '護四一D', '006','女性', 'TY Liu', '在這裡，你將會有許多難忘的時光，歡迎加入！', 0),
    ( '護四一D', '007','男性', 'MS Huang', '未來的日子裡，讓我們攜手追求更好的未來！', 0),
    ( '護四一D', '008','女性', 'PC Chang', '歡迎來到北護大家庭，一起享受學習的過程！', 1);
;
GO

SELECT * FROM Account;
SELECT * FROM Reply;

SELECT gender, COUNT(*) AS NumberOfStudents
FROM reply
GROUP BY gender;

SELECT Gender, COUNT(*) AS NumberOfStudents
FROM Reply
GROUP BY Gender
UNION ALL
SELECT '總數' AS Gender, COUNT(*) AS NumberOfStudents
FROM Reply;



SELECT ID, Class, StudentID, Name,Gender, Content, CONVERT(varchar, UP_Date, 23) AS UP_Date
from Reply ORDER BY LEN(Content) DESC;

SELECT ID, Class, StudentID, Name, Gender, Content, CONVERT(varchar, UP_Date, 23) AS UP_Date, UP_User, LEN(Content) AS ContentLength
FROM Reply
ORDER BY ContentLength DESC;

SELECT ID, Class, StudentID, Name, Gender, Content, CONVERT(varchar, UP_Date, 23) AS UP_Date, UP_User
FROM Reply
ORDER BY UP_User DESC;

SELECT ID, Class, StudentID, Name, Gender, Content, CONVERT(varchar, UP_Date, 20) AS UP_Date, UP_User FROM Reply ORDER BY UP_User DESC;
