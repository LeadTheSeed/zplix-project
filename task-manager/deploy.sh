#!/bin/bash

# Script to deploy the task-manager application

echo "Task Manager Deployment Script"
echo "============================="
echo ""

# Deploy Backend to Render
echo "1. Deploying Backend to Render..."
echo "This would typically be done through the Render dashboard or CLI"
echo "Instructions:"
echo "  - Push code to GitHub"
echo "  - Go to dashboard.render.com"
echo "  - Create a new Web Service"
echo "  - Connect to GitHub repository"
echo "  - Point to /task-manager/backend directory"
echo "  - Configure environment variables as specified in sample.env"
echo ""

# Deploy Frontend to Netlify
echo "2. Deploying Frontend to Netlify..."
echo "This would typically be done through the Netlify dashboard or CLI"
echo "Instructions:"
echo "  - Push code to GitHub"
echo "  - Go to app.netlify.com"
echo "  - Create a new site from Git"
echo "  - Connect to GitHub repository"
echo "  - Point to /task-manager/frontend directory"
echo "  - Set REACT_APP_API_URL to your Render backend URL"
echo ""

echo "3. Configure DNS on Zplix.com..."
echo "Instructions:"
echo "  - Add CNAME record tasks.zplix.com pointing to your Netlify site"
echo "  - Add CNAME record api.tasks.zplix.com pointing to your Render service"
echo ""

echo "Done! Your application should be accessible at:"
echo "- Frontend: https://tasks.zplix.com"
echo "- Backend API: https://api.tasks.zplix.com"
echo ""
echo "Thank you for using Task Manager!"
