// loading in quotes
document.addEventListener("DOMContentLoaded", () => {
    fetch("https://zenquotes.io/api/random")
      .then(response => response.json())
      .then(data => {
        const quoteElement = document.getElementById("quote-text");
        if (data && data[0]) {
          quoteElement.textContent = `"${data[0].q}" — ${data[0].a}`;
        } else {
          quoteElement.textContent = "Could not load quote.";
        }
      })
      .catch(error => {
        console.error("Quote loading error:", error);
        document.getElementById("quote-text").textContent = "Could not load quote.";
      });
  });
  
  // voice commands
  function startAnnyang() {
    if (annyang) {
      const commands = {
        'hello': () => alert('Hello!'),
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const lower = page.toLowerCase();
          if (lower.includes("home")) {
            window.location.href = "homepage.html";
          } else if (lower.includes("stocks")) {
            window.location.href = "stocks.html";
          } else if (lower.includes("dogs")) {
            window.location.href = "dogs.html";
          } else {
            alert("Page not found.");
          }
        }
      };
  
      annyang.addCommands(commands);
      annyang.start();
    }
  }
  
  function stopAnnyang() {
    if (annyang) {
      annyang.abort();
    }
  }  