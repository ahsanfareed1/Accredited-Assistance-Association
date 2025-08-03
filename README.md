# AAA Business Directory - Pakistan

A comprehensive business directory website for Pakistan, similar to Yelp, built with React.js, Node.js, and MongoDB. This platform allows customers to discover businesses, read reviews, and leave feedback, while providing business owners with tools to manage their profiles and connect with customers.

## Features

### For Customers
- **Search Businesses**: Find businesses by category, location, and keywords
- **User Authentication**: Register/login with email or Google OAuth
- **Leave Reviews**: Rate and review businesses with photos
- **Browse Categories**: Explore businesses by various categories
- **Location-based Search**: Find businesses near specific cities in Pakistan

### For Business Owners
- **Business Registration**: Create and verify business profiles
- **Profile Management**: Update business information, hours, contact details
- **Review Management**: View and respond to customer reviews
- **Dashboard**: Track business performance and customer engagement

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Search**: Instant search suggestions and filtering
- **Authentication**: JWT-based auth with Google OAuth integration
- **Image Upload**: Support for business logos and review photos (Cloudinary)
- **Database**: MongoDB with optimized indexes for search performance
- **API**: RESTful API with comprehensive validation

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **React Router Dom** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** with Yup validation
- **Styled Components** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Passport.js** for Google OAuth
- **Bcrypt** for password hashing
- **Cloudinary** for image storage
- **Express Validator** for request validation

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (optional)
- Cloudinary account (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aaa-business-directory
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, client)
npm run install-all
```

### 3. Environment Configuration

#### Server Configuration
Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aaa_business_directory
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:3000
```

#### Client Configuration
Create `client/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a cluster and database
3. Get the connection string
4. Update `MONGODB_URI` in `server/.env`

### 5. Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `server/.env`

### 6. Cloudinary Setup (Optional)
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update Cloudinary credentials in `server/.env`

### 7. Run the Application

#### Development Mode
```bash
# Run both client and server concurrently
npm run dev

# Or run separately:
# Terminal 1 - Server
npm run server

# Terminal 2 - Client  
npm run client
```

#### Production Mode
```bash
# Build client
npm run build

# Start server (serves built client)
cd server && npm start
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/business/register` - Business registration
- `POST /api/auth/business/login` - Business login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/user/me` - Get current user
- `GET /api/auth/business/me` - Get current business

### Business
- `GET /api/business` - Get all businesses (with filters)
- `GET /api/business/:id` - Get single business
- `GET /api/business/featured/list` - Get featured businesses
- `PUT /api/business/profile` - Update business profile
- `PUT /api/business/hours` - Update business hours

### Search
- `GET /api/search` - Search businesses
- `GET /api/search/suggestions` - Get search suggestions

### Reviews
- `POST /api/review` - Create review
- `GET /api/review/business/:businessId` - Get business reviews
- `PUT /api/review/:id` - Update review
- `DELETE /api/review/:id` - Delete review
- `POST /api/review/:id/helpful` - Mark review as helpful

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/reviews` - Get user's reviews

## Project Structure

```
aaa-business-directory/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── config/            # Configuration files
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main App component
│   └── public/            # Static files
└── package.json           # Root package.json
```

## Sample Data

The application includes predefined data for:
- **Categories**: Restaurant, Shopping, Health & Medical, etc.
- **Cities**: Major Pakistani cities (Karachi, Lahore, Islamabad, etc.)
- **States**: Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, ICT

## Key Features Implementation

### Search Functionality
- Text search across business names and descriptions
- Category-based filtering
- Location-based filtering
- Auto-suggestions with typeahead

### Authentication System
- JWT-based authentication
- Google OAuth integration
- Separate auth flows for customers and businesses
- Protected routes with role-based access

### Review System
- 5-star rating system
- Photo uploads with reviews
- Review moderation
- Helpful/unhelpful voting
- Business rating aggregation

### Business Management
- Complete business profile management
- Operating hours management
- Contact information updates
- Review monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in this repository
- Email: support@aaaassociation.com

## Future Enhancements

- [ ] Real-time chat between customers and businesses
- [ ] Business analytics dashboard
- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Business verification system
- [ ] Payment integration for premium features
- [ ] Multi-language support (Urdu)
- [ ] Map integration with business locations
- [ ] Email notifications for reviews
- [ ] Social media integration