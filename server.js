const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');

const app = express();
const port = 3000;

const pastesDir = path.join(__dirname, 'pastes');

if (!fs.existsSync(pastesDir)){
  fs.mkdirSync(pastesDir);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/icon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/icon.ico'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/create', (req, res) => {
  const content = req.body.content;
  const pasteId = Date.now().toString();
  const filePath = path.join(pastesDir, `${pasteId}.txt`);

  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.log("An error occurred while writing to file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect(`/paste/${pasteId}`);
  });
});

app.get('/paste/:id', (req, res) => {
  const filePath = path.join(pastesDir, `${req.params.id}.txt`);

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.log("An error occurred while reading from file:", err);
      return res.redirect('https://404.hatedcode.com');
    }

    const detectedLanguage = hljs.highlightAuto(content).language || 'plaintext';
    console.log("Detected language:", detectedLanguage);

    const styledContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <link rel="icon" href="/icon.ico" type="image/x-icon">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-okaidia.min.css" rel="stylesheet" />
    <style>
        body {
         font-family: Arial, sans-serif;
         background-color: #202020;
         color: white;
         margin: 0;
         padding: 0;
         display: flex;
         align-items: center;
         min-height: 100vh;
         min-height: 800px;

         .return-button {
          background-color: #4CAF50;
          color: white;
          padding: 14px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }      

        .return-button:hover {
          background-color: #45a049;
        }

        #returnButtonWrapper {
          position: fixed;
          bottom: 0;
          right: 0;
          margin: 20px;
        }

      }
    </style>
    </head>
    <body>
    <div id="paste-box">
    <pre><code class="language-${detectedLanguage}">${content}</code></pre>
    <div style="text-align:center; margin-top: 20px;">
    <div id="returnButtonWrapper">
      <button id="returnButton" class="return-button">Return</button>
    </div>
    </div>
    </div>
    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-css.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-clike.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-javascript.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-python.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-ruby.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-java.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-c.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-csharp.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-cpp.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-swift.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-rust.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-kotlin.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-dart.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-typescript.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-sql.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-json.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-bash.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-powershell.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-yaml.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-markdown.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-markup.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-objectivec.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-scala.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-groovy.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-r.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-perl.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-matlab.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-latex.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-fsharp.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-coffeescript.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-erlang.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-haml.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-less.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-stylus.min.js"></script>
      
            <script defer>
             document.addEventListener("DOMContentLoaded", function()
               {Prism.highlightAll();
             });
            </script>
          <script>
          document.title = "Hated's Pastebin - ${req.params.id}";
          console.log("Developed By HatedCode")

          document.getElementById("returnButton").addEventListener("click", function() {
            window.location.href = "/";
          });
      </script>
    </body>
  </html>
`;

    res.send(styledContent);
  });
});

app.listen(80, () => {
  console.log(`Server running at http://localhost:80/`);
});