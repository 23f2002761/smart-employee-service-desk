const { sql, getPool } = require("../config/db");

const createTicket = async ({
  title,
  description,
  categoryId,
  priority,
  createdBy
}) => {
  const pool = getPool();

  const result = await pool
    .request()
    .input("title", sql.VarChar(200), title)
    .input("description", sql.VarChar(sql.MAX), description)
    .input("categoryId", sql.Int, categoryId)
    .input("priority", sql.VarChar(20), priority || "MEDIUM")
    .input("createdBy", sql.Int, createdBy)
    .query(`
      INSERT INTO Tickets
      (
        Title,
        Description,
        CategoryId,
        Priority,
        Status,
        CreatedBy
      )
      OUTPUT INSERTED.TicketId
      VALUES
      (
        @title,
        @description,
        @categoryId,
        @priority,
        'OPEN',
        @createdBy
      )
    `);

  return result.recordset[0];
};

const getTickets = async ({
  status,
  priority,
  categoryId,
  assignedTo,
  createdBy,
  search
}) => {
  const pool = getPool();

  const request = pool.request();

  let query = `
    SELECT
      t.TicketId,
      t.Title,
      t.Description,
      t.Priority,
      t.Status,
      t.CreatedDate,
      t.UpdatedDate,
      t.ClosedDate,

      c.CategoryId,
      c.Name AS CategoryName,

      creator.UserId AS CreatorId,
      creator.Name AS CreatorName,

      assignee.UserId AS AssigneeId,
      assignee.Name AS AssigneeName

    FROM Tickets t

    INNER JOIN Categories c
      ON t.CategoryId = c.CategoryId

    INNER JOIN Users creator
      ON t.CreatedBy = creator.UserId

    LEFT JOIN Users assignee
      ON t.AssignedTo = assignee.UserId

    WHERE 1 = 1
  `;

  if (status) {
    query += " AND t.Status = @status";
    request.input("status", sql.VarChar(30), status);
  }

  if (priority) {
    query += " AND t.Priority = @priority";
    request.input("priority", sql.VarChar(20), priority);
  }

  if (categoryId) {
    query += " AND t.CategoryId = @categoryId";
    request.input("categoryId", sql.Int, categoryId);
  }

  if (assignedTo) {
    query += " AND t.AssignedTo = @assignedTo";
    request.input("assignedTo", sql.Int, assignedTo);
  }

  if (createdBy) {
    query += " AND t.CreatedBy = @createdBy";
    request.input("createdBy", sql.Int, createdBy);
  }

  if (search) {
    query += `
      AND (
        t.Title LIKE @search
        OR t.Description LIKE @search
      )
    `;

    request.input("search", sql.VarChar(200), `%${search}%`);
  }

  query += " ORDER BY t.CreatedDate DESC";

  const result = await request.query(query);

  return result.recordset;
};

const getTicketById = async (ticketId) => {
  const pool = getPool();

  const ticketResult = await pool
    .request()
    .input("ticketId", sql.Int, ticketId)
    .query(`
      SELECT
        t.TicketId,
        t.Title,
        t.Description,
        t.Priority,
        t.Status,
        t.CreatedDate,
        t.UpdatedDate,
        t.ClosedDate,

        c.CategoryId,
        c.Name AS CategoryName,

        creator.UserId AS CreatorId,
        creator.Name AS CreatorName,
        creator.Email AS CreatorEmail,

        assignee.UserId AS AssigneeId,
        assignee.Name AS AssigneeName,
        assignee.Email AS AssigneeEmail

      FROM Tickets t

      INNER JOIN Categories c
        ON t.CategoryId = c.CategoryId

      INNER JOIN Users creator
        ON t.CreatedBy = creator.UserId

      LEFT JOIN Users assignee
        ON t.AssignedTo = assignee.UserId

      WHERE t.TicketId = @ticketId
    `);

  if (ticketResult.recordset.length === 0) {
    return null;
  }

  const ticket = ticketResult.recordset[0];

  const commentsResult = await pool
    .request()
    .input("ticketId", sql.Int, ticketId)
    .query(`
      SELECT
        cm.CommentId,
        cm.Notes,
        cm.CreatedDate,
        u.UserId,
        u.Name AS UserName

      FROM Comments cm

      INNER JOIN Users u
        ON cm.UserId = u.UserId

      WHERE cm.TicketId = @ticketId

      ORDER BY cm.CreatedDate ASC
    `);

  ticket.comments = commentsResult.recordset;

  return ticket;
};

const updateTicket = async (
  ticketId,
  { priority, status, assignedTo, resolutionNotes, userId }
) => {
  const pool = getPool();

  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const request = new sql.Request(transaction);

    const fields = [];

    if (priority !== undefined) {
      fields.push("Priority = @priority");

      request.input(
        "priority",
        sql.VarChar(20),
        priority
      );
    }

    if (status !== undefined) {
      fields.push("Status = @status");

      request.input(
        "status",
        sql.VarChar(30),
        status
      );
    }

    if (assignedTo !== undefined) {
      fields.push("AssignedTo = @assignedTo");

      request.input(
        "assignedTo",
        sql.Int,
        assignedTo
      );
    }

    fields.push("UpdatedDate = SYSDATETIME()");

    request.input("ticketId", sql.Int, ticketId);

    const updateResult = await request.query(`
      UPDATE Tickets
      SET ${fields.join(", ")}
      WHERE TicketId = @ticketId
    `);

    if (updateResult.rowsAffected[0] === 0) {
      await transaction.rollback();
      return null;
    }

    if (resolutionNotes && userId) {
      const commentRequest = new sql.Request(transaction);

      commentRequest
        .input("ticketId", sql.Int, ticketId)
        .input("userId", sql.Int, userId)
        .input("notes", sql.VarChar(sql.MAX), resolutionNotes);

      await commentRequest.query(`
        INSERT INTO Comments
        (
          TicketId,
          UserId,
          Notes
        )
        VALUES
        (
          @ticketId,
          @userId,
          @notes
        )
      `);
    }

    await transaction.commit();

    return await getTicketById(ticketId);

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const closeTicket = async (ticketId) => {
  const pool = getPool();

  const result = await pool
    .request()
    .input("ticketId", sql.Int, ticketId)
    .query(`
      UPDATE Tickets

      SET
        Status = 'CLOSED',
        ClosedDate = SYSDATETIME(),
        UpdatedDate = SYSDATETIME()

      WHERE TicketId = @ticketId
        AND Status <> 'CLOSED'
    `);

  if (result.rowsAffected[0] === 0) {
    return null;
  }

  return await getTicketById(ticketId);
};

const getUsers = async ({ role, departmentId }) => {
  const pool = getPool();

  const request = pool.request();

  let query = `
    SELECT
      u.UserId,
      u.Name,
      u.Email,
      u.Role,
      d.DepartmentId,
      d.Name AS DepartmentName

    FROM Users u

    LEFT JOIN Departments d
      ON u.DepartmentId = d.DepartmentId

    WHERE 1 = 1
  `;

  if (role) {
    query += " AND u.Role = @role";
    request.input("role", sql.VarChar(20), role);
  }

  if (departmentId) {
    query += " AND u.DepartmentId = @departmentId";
    request.input("departmentId", sql.Int, departmentId);
  }

  query += " ORDER BY u.Name";

  const result = await request.query(query);

  return result.recordset;
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  getUsers
};