import Book from "../../models/SellBooks.js";

const sellBookController = async (req, res, next) => {
    try {
      const { title, author, isbn, price, condition, description, category } = req.body;
      const seller = req.user?.id;
  
      const requiredFields = ['title', 'author', 'condition', 'category', 'price'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
  
      if (!seller) {
        return res.status(401).json({
          success: false,
          error: "Authentication required"
        });
      }
  
      const priceValue = parseFloat(price);
      if (isNaN(priceValue)) {
        return res.status(400).json({ 
          success: false,
          error: "Price must be a valid number" 
        });
      }
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: "At least one image is required" 
        });
      }
  
      const images = req.files.map(file => `/uploads/books/${file.filename}`);
  
      const book = await Book.create({
        title,
        author,
        isbn,
        price: priceValue,
        condition,
        description,
        images,
        seller,
        category,
        status: 'Pending'
      });
  
      res.status(201).json({
        success: true,
        message: "Book listed successfully. Waiting for admin approval.",
        data: book
      });
    } catch (error) {
      next(error);
    }
  };

export default sellBookController;