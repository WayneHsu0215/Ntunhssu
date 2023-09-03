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
    ( '是', '1','男性', '有', '測試中許願區', 1),
    ( '否', '4','男性', '沒有', '測試中許願區', 1),
    ( '是', '2','女性', '有', '測試中許願區', 0),
    ( '是', '1','男性', '有', '測試中許願區', 1),
    ( '是', '3','男性', '有', '測試中許願區', 1),
    ( '否', '5','女性', '沒有', '測試中許願區', 0),
    ( '否', '4','女性', '沒有', '測試中許願區', 1),
    ( '否', '3','女性', '沒有', '測試中許願區', 1),
    ( '否', '5','女性', '沒有', '測試中許願區', 0),
    ( '否', '5','女性', '沒有', '測試中許願區', 1),
;
GO

INSERT INTO Reply
( Class, StudentID, Gender,Name, Content, UP_User)
VALUES
    ( '否', '1','男性', '有', '測試中許願區', 1),
    ( '否', '4','男性', '沒有', '測試中許願區', 1)
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


SELECT Gender, COUNT(*) AS NumberOfStudents
FROM Reply
GROUP BY Gender
UNION ALL
SELECT '總數' AS Gender, COUNT(*) AS NumberOfStudents
FROM Reply;



---

SELECT 'Gender' AS Category, Gender AS Item, COUNT(*) AS Count
FROM Reply
GROUP BY Gender
UNION ALL
-- 統計 Class
SELECT 'Class' AS Category, Class AS Item, COUNT(*) AS Count
FROM Reply
GROUP BY Class
UNION ALL
-- 統計 Name
SELECT 'Name' AS Category, Name AS Item, COUNT(*) AS Count
FROM Reply
GROUP BY Name
UNION ALL
-- 統計總數
SELECT 'Total' AS Category, '總數' AS Item, COUNT(*) AS Count
FROM Reply

SELECT 'StudentID' AS Category, StudentID AS Item, COUNT(*) AS Count
FROM Reply
GROUP BY StudentID