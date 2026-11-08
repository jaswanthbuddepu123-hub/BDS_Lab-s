const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();

let db = null;

const dbPath = path.join(__dirname, "database.db");

app.use(express.json());

const PORT = process.env.PORT || 3000;

// API 1: GET all books with search, sorting, pagination and filtering

app.get("/books", async (request, response) => {
  try {
    const {
      search_q,
      order_by = "id",
      order = "ASC",
      limit = 10,
      offset = 0,
      min_price,
      max_price,
    } = request.query;

    // Validate sorting column
    const validColumns = ["id", "title", "author", "price", "pages"];

    if (!validColumns.includes(order_by)) {
      return response.status(400).send({
        message: "Invalid order_by column",
      });
    }

    // Validate sorting order
    const sortOrder = order.toUpperCase();

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return response.status(400).send({
        message: "Order must be ASC or DESC",
      });
    }

    // Validate limit and offset
    const limitValue = Number(limit);
    const offsetValue = Number(offset);

    if (
      !Number.isInteger(limitValue) ||
      !Number.isInteger(offsetValue) ||
      limitValue <= 0 ||
      offsetValue < 0
    ) {
      return response.status(400).send({
        message: "Invalid limit or offset",
      });
    }

    // Validate prices
    if (
      (min_price !== undefined &&
        (min_price.trim() === "" || !Number.isFinite(Number(min_price)))) ||
      (max_price !== undefined &&
        (max_price.trim() === "" || !Number.isFinite(Number(max_price))))
    ) {
      return response.status(400).send({
        message: "Minimum and maximum price must be numbers",
      });
    }

    // Validate price range
    if (
      min_price !== undefined &&
      max_price !== undefined &&
      Number(min_price) > Number(max_price)
    ) {
      return response.status(400).send({
        message: "Minimum price cannot be greater than maximum price",
      });
    }

    let getBooksQuery = `SELECT * FROM book`;

    const conditions = [];
    const values = [];

    // Search by title
    if (search_q !== undefined) {
      conditions.push("title LIKE ?");
      values.push(`%${search_q}%`);
    }

    // Minimum price filter
    if (min_price !== undefined) {
      conditions.push("price >= ?");
      values.push(Number(min_price));
    }

    // Maximum price filter
    if (max_price !== undefined) {
      conditions.push("price <= ?");
      values.push(Number(max_price));
    }

    // Add WHERE conditions
    if (conditions.length > 0) {
      getBooksQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    getBooksQuery += ` ORDER BY ${order_by} ${sortOrder}`;

    // Pagination
    getBooksQuery += ` LIMIT ? OFFSET ?`;

    values.push(limitValue, offsetValue);

    const books = await db.all(getBooksQuery, values);

    response.status(200).send(books);
  } catch (error) {
    response.status(500).send({
      message: error.message,
    });
  }
});

// API 2: Get a single book by ID

app.get("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Validate book ID
    if (!/^[1-9]\d*$/.test(bookId)) {
      return response.status(400).send({
        message: "Invalid book ID",
      });
    }

    // Get book from database
    const getBookQuery = `
            SELECT * FROM book
            WHERE id = ?;
        `;

    const book = await db.get(getBookQuery, [bookId]);

    // Check whether book exists
    if (book === undefined) {
      return response.status(404).send({
        message: "Book not found",
      });
    }

    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({
      message: error.message,
    });
  }
});


// API 2: POST - Add a new book

app.post("/books", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Validate required fields
    if (
      title === undefined ||
      author === undefined ||
      price === undefined ||
      typeof title !== "string" ||
      typeof author !== "string" ||
      title.trim() === "" ||
      author.trim() === ""
    ) {
      return response.status(400).send({
        message: "Title, author and price are required",
      });
    }

    // Validate price
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return response.status(400).send({
        message: "Price must be a valid non-negative number",
      });
    }

    // Validate pages if provided
    if (pages !== undefined && (!Number.isInteger(pages) || pages <= 0)) {
      return response.status(400).send({
        message: "Pages must be a positive integer",
      });
    }

    const addBookQuery = `
            INSERT INTO book (title, author, price, pages)
            VALUES (?, ?, ?, ?);
        `;

    await db.run(addBookQuery, [
      title.trim(),
      author.trim(),
      price,
      pages ?? null,
    ]);

    response.status(201).send({
      message: "Book added successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: error.message,
    });
  }
});

// API 3: PUT - Update an existing book

app.put("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    // Validate book ID
    if (!/^[1-9]\d*$/.test(bookId)) {
      return response.status(400).send({
        message: "Invalid book ID",
      });
    }

    // Check whether book exists
    const getBookQuery = `
            SELECT * FROM book
            WHERE id = ?;
        `;

    const existingBook = await db.get(getBookQuery, [bookId]);

    if (existingBook === undefined) {
      return response.status(404).send({
        message: "Book not found",
      });
    }

    // Validate required fields
    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return response.status(400).send({
        message: "Valid title, author and price are required",
      });
    }

    // Validate pages
    if (pages !== undefined && (!Number.isInteger(pages) || pages <= 0)) {
      return response.status(400).send({
        message: "Pages must be a positive integer",
      });
    }

    const updateBookQuery = `
            UPDATE book
            SET title = ?, author = ?, price = ?, pages = ?
            WHERE id = ?;
        `;

    await db.run(updateBookQuery, [
      title.trim(),
      author.trim(),
      price,
      pages ?? existingBook.pages,
      bookId,
    ]);

    response.status(200).send({
      message: "Book updated successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: error.message,
    });
  }
});

// API 4: DELETE - Delete an existing book

app.delete("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Validate book ID
    if (!/^[1-9]\d*$/.test(bookId)) {
      return response.status(400).send({
        message: "Invalid book ID",
      });
    }

    // Check whether book exists
    const getBookQuery = `
            SELECT * FROM book
            WHERE id = ?;
        `;

    const existingBook = await db.get(getBookQuery, [bookId]);

    if (existingBook === undefined) {
      return response.status(404).send({
        message: "Book not found",
      });
    }

    // Delete book
    const deleteBookQuery = `
            DELETE FROM book
            WHERE id = ?;
        `;

    await db.run(deleteBookQuery, [bookId]);

    response.status(200).send({
      message: "Book deleted successfully",
    });
  } catch (error) {
    response.status(500).send({
      message: error.message,
    });
  }
});

// Initialize Database and Server

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
