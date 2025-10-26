import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password cannot exceed 128 characters',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .trim()
    .messages({
      'string.pattern.base': 'Please enter a valid phone number',
    }),
  address: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    district: Joi.string().trim().required(),
    ward: Joi.string().trim().required(),
  }),
});

// Product validation schemas
export const createProductSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Product title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters',
    }),
  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 2000 characters',
    }),
  price: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Price is required',
    }),
  priceValue: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Price must be positive',
    }),
  currency: Joi.string()
    .valid('VND', 'USD', 'EUR')
    .default('VND'),
  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .max(10)
    .required()
    .messages({
      'array.min': 'At least one image is required',
      'array.max': 'Cannot exceed 10 images',
    }),
  category: Joi.string()
    .valid('Tranh vẽ', 'Ảnh nghệ thuật', 'Điêu khắc', 'Đồ trang trí')
    .required()
    .messages({
      'any.only': 'Invalid category',
    }),
  dimensions: Joi.object({
    width: Joi.number().positive().required(),
    height: Joi.number().positive().required(),
    depth: Joi.number().positive().optional(),
    unit: Joi.string().valid('cm', 'm', 'inch', 'ft').default('cm'),
  }).required(),
  material: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Material is required',
      'string.min': 'Material must be at least 2 characters',
      'string.max': 'Material cannot exceed 100 characters',
    }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.min': 'Year must be after 1900',
      'number.max': 'Year cannot be in the future',
    }),
  artistId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid artist ID format',
    }),
  stock: Joi.number()
    .integer()
    .min(0)
    .max(999)
    .default(1),
  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(10)
    .default([]),
  featured: Joi.boolean().default(false),
});

export const updateProductSchema = createProductSchema.fork(
  ['title', 'description', 'price', 'priceValue', 'images', 'category', 'dimensions', 'material', 'year', 'artistId'],
  (schema) => schema.optional()
).concat(Joi.object({
  isAvailable: Joi.boolean(),
}));

// Artist validation schemas
export const createArtistSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Artist name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
    }),
  specialty: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Specialty is required',
      'string.min': 'Specialty must be at least 2 characters',
      'string.max': 'Specialty cannot exceed 100 characters',
    }),
  bio: Joi.string()
    .trim()
    .min(20)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Bio is required',
      'string.min': 'Bio must be at least 20 characters',
      'string.max': 'Bio cannot exceed 2000 characters',
    }),
  avatar: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'Avatar is required',
      'string.uri': 'Avatar must be a valid URL',
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please enter a valid email address',
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .trim()
    .messages({
      'string.pattern.base': 'Please enter a valid phone number',
    }),
  socialLinks: Joi.object({
    instagram: Joi.string().uri().optional(),
    facebook: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    twitter: Joi.string().uri().optional(),
  }).optional(),
});

export const updateArtistSchema = createArtistSchema.fork(
  ['name', 'specialty', 'bio', 'avatar'],
  (schema) => schema.optional()
).concat(Joi.object({
  isActive: Joi.boolean(),
}));

// Cart validation schemas
export const addToCartSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid product ID format',
    }),
  quantity: Joi.number()
    .integer()
    .min(1)
    .max(99)
    .required()
    .messages({
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 99',
    }),
});

export const updateCartItemSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: Joi.number()
    .integer()
    .min(0)
    .max(99)
    .required()
    .messages({
      'number.min': 'Quantity cannot be negative',
      'number.max': 'Quantity cannot exceed 99',
    }),
});

// Order validation schemas
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(Joi.object({
      productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
      quantity: Joi.number().integer().min(1).max(99).required(),
    }))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required',
    }),
  shippingAddress: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
    street: Joi.string().trim().min(5).max(200).required(),
    city: Joi.string().trim().min(2).max(50).required(),
    district: Joi.string().trim().min(2).max(50).required(),
    ward: Joi.string().trim().min(2).max(50).required(),
  }).required(),
  paymentMethod: Joi.string()
    .valid('cod', 'bank_transfer', 'stripe', 'paypal')
    .required()
    .messages({
      'any.only': 'Invalid payment method',
    }),
  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters',
    }),
});

// Query validation schemas
export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  sort: Joi.string().valid('createdAt', 'price', 'title', 'views', 'likes').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().trim().max(100).optional(),
  category: Joi.string().valid('Tranh vẽ', 'Ảnh nghệ thuật', 'Điêu khắc', 'Đồ trang trí').optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  artist: Joi.string().trim().optional(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  featured: Joi.boolean().optional(),
});

// Validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: errorMessage,
      });
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: errorMessage,
      });
    }

    req.query = value;
    next();
  };
};
