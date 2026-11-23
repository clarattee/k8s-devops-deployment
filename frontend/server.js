const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Uses BACKEND_URL environment variable on AWS, or defaults to localhost:5000
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form and connect to the Flask backend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>AWS DevOps Deployment</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
        input { width: 100%; padding: 8px; margin: 8px 0; box-sizing: border-box; }
        button { padding: 10px 15px; background-color: #ff9900; color: white; border: none; cursor: pointer; }
        #response { margin-top: 20px; padding: 10px; background: #f4f4f4; border-left: 4px solid #ff9900; }
      </style>
    </head>
    <body>
      <h2>AWS DevOps App (Express + Flask)</h2>
      <p><strong>Connected Backend:</strong> ${BACKEND_URL}</p>
      <form id="userForm">
        <label>Name:</label>
        <input type="text" id="name" name="name" required placeholder="Enter your name" />
        <label>Email:</label>
        <input type="email" id="email" name="email" required placeholder="Enter your email" />
        <button type="submit">Submit to Flask Backend</button>
      </form>
      <div id="response">Waiting for submission...</div>

      <script>
        document.getElementById('userForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          
          try {
            const res = await fetch('${BACKEND_URL}/api/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email })
            });
            const data = await res.json();
            document.getElementById('response').innerHTML = 
              '<strong>Response from Flask:</strong> ' + data.message + ' (' + data.email + ')';
          } catch (err) {
            document.getElementById('response').innerHTML = 
              '<strong>Error connecting to backend:</strong> ' + err.message;
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express frontend running on port ${PORT}`);
  console.log(`Configured to reach Flask backend at: ${BACKEND_URL}`);
});
