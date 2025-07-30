# Implementing Static File Serving in Express

## Challenge

Now that you have a working REST API with full CRUD operations, it would be useful for the backend to serve frontend files, making it easier to deploy the application as a whole.

In this exercise, you will:

1. Create a `public` folder to store static frontend files.
2. Modify your Express application to serve static files from the `public` directory.
3. Ensure that when you run the application, you can access your web page at `http://localhost:3000/`.

By the end of this exercise, your Express backend will not only provide an API but also serve static HTML, CSS, and JavaScript files for the frontend.

---

## Key Learnings

- Understanding how to serve static files using Express.
- Configuring Express to serve frontend files alongside a REST API.
- Running a full-stack application with both backend and frontend served from the same server.

---

## User Story

As a developer,  
I want my Express backend to serve frontend files,  
So that I can easily integrate the frontend and backend for deployment.

---

## Acceptance Criteria

- [ ] Review the example to see what code you might need to implement within the exercise
- [ ] Modify the Express server to serve static files from the `public` folder.
- [ ] Ensure that visiting `http://localhost:3000/` in a browser loads `index.html`.
- [ ] The existing REST API endpoints should still function correctly.

---

## Getting Started

- Run the server and test it

```bash
npm i
npm run start
```

- Open a browser and go to http://localhost:3000/ to see the served HTML file.
- Verify that API endpoints (e.g., http://localhost:3000/api/data) still work as expected.

Happy Coding! 🚀
