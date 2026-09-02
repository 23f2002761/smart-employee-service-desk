CREATE DATABASE EmployeeServiceDesk;
GO

USE EmployeeServiceDesk;
GO

CREATE TABLE Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Role VARCHAR(20) NOT NULL,
    DepartmentId INT NULL,

    CONSTRAINT FK_Users_Departments
        FOREIGN KEY (DepartmentId)
        REFERENCES Departments(DepartmentId),

    CONSTRAINT CK_Users_Role
        CHECK (Role IN ('EMPLOYEE', 'SUPPORT', 'ADMIN'))
);

CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Tickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,

    Title VARCHAR(200) NOT NULL,
    Description VARCHAR(MAX) NOT NULL,
    CategoryId INT NOT NULL,

    Priority VARCHAR(20) NOT NULL
        CONSTRAINT DF_Tickets_Priority DEFAULT 'MEDIUM',

    Status VARCHAR(30) NOT NULL
        CONSTRAINT DF_Tickets_Status DEFAULT 'OPEN',

    CreatedBy INT NOT NULL,
    AssignedTo INT NULL,

    CreatedDate DATETIME2 NOT NULL
        CONSTRAINT DF_Tickets_CreatedDate DEFAULT SYSDATETIME(),

    UpdatedDate DATETIME2 NOT NULL
        CONSTRAINT DF_Tickets_UpdatedDate DEFAULT SYSDATETIME(),

    ClosedDate DATETIME2 NULL,

    CONSTRAINT FK_Tickets_Category
        FOREIGN KEY (CategoryId)
        REFERENCES Categories(CategoryId),

    CONSTRAINT FK_Tickets_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Users(UserId),

    CONSTRAINT FK_Tickets_AssignedTo
        FOREIGN KEY (AssignedTo)
        REFERENCES Users(UserId),

    CONSTRAINT CK_Tickets_Priority
        CHECK (Priority IN ('LOW', 'MEDIUM', 'HIGH')),

    CONSTRAINT CK_Tickets_Status
        CHECK (
            Status IN (
                'OPEN',
                'ASSIGNED',
                'IN_PROGRESS',
                'RESOLVED',
                'CLOSED'
            )
        )
);

CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,

    TicketId INT NOT NULL,
    UserId INT NOT NULL,
    Notes VARCHAR(MAX) NOT NULL,

    CreatedDate DATETIME2 NOT NULL
        CONSTRAINT DF_Comments_CreatedDate DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Comments_Ticket
        FOREIGN KEY (TicketId)
        REFERENCES Tickets(TicketId),

    CONSTRAINT FK_Comments_User
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);

CREATE INDEX IX_Tickets_Status
ON Tickets(Status);

CREATE INDEX IX_Tickets_CategoryId
ON Tickets(CategoryId);

CREATE INDEX IX_Tickets_Priority
ON Tickets(Priority);

CREATE INDEX IX_Tickets_AssignedTo
ON Tickets(AssignedTo);

CREATE INDEX IX_Tickets_CreatedBy
ON Tickets(CreatedBy);

CREATE INDEX IX_Tickets_CreatedDate
ON Tickets(CreatedDate);