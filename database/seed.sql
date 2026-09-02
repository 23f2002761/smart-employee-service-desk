USE EmployeeServiceDesk;
GO



INSERT INTO Departments (Name)
VALUES
    ('IT'),
    ('HR'),
    ('Facilities'),
    ('Finance'),
    ('Access Management');


INSERT INTO Categories (Name)
VALUES
    ('IT'),
    ('HR'),
    ('Facilities'),
    ('Finance'),
    ('Access Management');



INSERT INTO Users
    (Name, Email, Role, DepartmentId)
VALUES
    ('Rahul Sharma', 'rahul@company.com', 'EMPLOYEE', NULL),

    ('Ananya Singh', 'ananya@company.com', 'EMPLOYEE', NULL),

    ('Priya Verma', 'priya@company.com', 'SUPPORT',
        (SELECT DepartmentId
         FROM Departments
         WHERE Name = 'IT')),

    ('Amit Kumar', 'amit@company.com', 'SUPPORT',
        (SELECT DepartmentId
         FROM Departments
         WHERE Name = 'IT')),

    ('Neha Gupta', 'neha@company.com', 'SUPPORT',
        (SELECT DepartmentId
         FROM Departments
         WHERE Name = 'HR')),

    ('Rohit Singh', 'rohit@company.com', 'SUPPORT',
        (SELECT DepartmentId
         FROM Departments
         WHERE Name = 'Facilities')),

    ('Sneha Patel', 'sneha@company.com', 'SUPPORT',
        (SELECT DepartmentId
         FROM Departments
         WHERE Name = 'Finance')),

    ('Vikas Mehta', 'vikas@company.com', 'SUPPORT',
        (SELECT DepartmentId
         FROM Departments
         WHERE Name = 'Access Management')),

    ('Admin User', 'admin@company.com', 'ADMIN', NULL);



INSERT INTO Tickets
(
    Title,
    Description,
    CategoryId,
    Priority,
    Status,
    CreatedBy,
    AssignedTo
)
VALUES

(
    'Unable to access VPN',
    'VPN is not connecting while working remotely.',
    (SELECT CategoryId FROM Categories WHERE Name = 'IT'),
    'HIGH',
    'IN_PROGRESS',
    1,
    3
),

(
    'Laptop not booting',
    'Company laptop is not starting before an important customer presentation.',
    (SELECT CategoryId FROM Categories WHERE Name = 'IT'),
    'HIGH',
    'OPEN',
    2,
    NULL
),

(
    'Leave policy clarification',
    'Need clarification regarding the annual leave policy.',
    (SELECT CategoryId FROM Categories WHERE Name = 'HR'),
    'LOW',
    'RESOLVED',
    1,
    5
),

(
    'Air conditioning issue',
    'Air conditioning is not working in the office workspace.',
    (SELECT CategoryId FROM Categories WHERE Name = 'Facilities'),
    'HIGH',
    'ASSIGNED',
    2,
    6
),

(
    'Reimbursement approval pending',
    'Reimbursement request has been pending for more than 30 days.',
    (SELECT CategoryId FROM Categories WHERE Name = 'Finance'),
    'HIGH',
    'OPEN',
    1,
    NULL
),

(
    'Application access request',
    'Requesting access to the new project management application.',
    (SELECT CategoryId FROM Categories WHERE Name = 'Access Management'),
    'MEDIUM',
    'IN_PROGRESS',
    2,
    8
);



INSERT INTO Comments
(
    TicketId,
    UserId,
    Notes
)
VALUES

(
    1,
    3,
    'Started investigating the VPN configuration.'
),

(
    1,
    4,
    'VPN client appears to be outdated.'
),

(
    3,
    5,
    'Provided the employee with the updated leave policy.'
),

(
    6,
    8,
    'Access request has been submitted for approval.'
);