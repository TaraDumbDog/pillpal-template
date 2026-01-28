# pillpal-template

This is just a rough idea with the bare bones function to start you off of your Pillpal idea based on the Softr template you made, but rewritten in raw html, Tailwind css and javascript. Here's a brief walkthrough on the process.

Not much planning was done as the goal functionalities are relatively simple.
1. User accesses site and logs their pill info onto the site via a form of some sort
2. User provides information on pills, namely time, dosage and importance
3. The website sends an alert of some sort to the user when they should be taking the pill

Putting aside everything to do with a server aside for now which includes authentication systems, user accounts and a database setup, the following analysis on the functions mentioned above can be easily done. We can abstract this further into 2 main functions:
1. Pill logging
  - An HTML form system and a user input system via textboxes and buttons
  - This information can be stored using local browser storage (LocalStorage)
  - Stored in JSON for easy editing and querying
2. Reminder system
  - a set interval loop to check if current system time matches inputted time
  - using built in alert() in JavaScript as a placeholder function for SMS/email implementations later on
And this concludes the idea and framework of how `app.js` works

Above is pretty much all  the planning needed, moving onto the actual creation of the website. Site is first handrafted in raw HTML to lay out the textboxes, I left a snapshot of the code in a separate file, refer to `raw.html` 
<img width="926" height="592" alt="Screenshot 2026-01-28 at 10 57 36 PM" src="https://github.com/user-attachments/assets/79e37a67-63ae-452b-8b46-7b6f0c597c73" />


Above screenshot shows the raw ugly html unstyled version of how it looks, recommended to lay out the bare bones of the site using HTML before any form of styling. Then here's the version with CSS <img width="1048" height="563" alt="Screenshot 2026-01-28 at 10 43 42 PM" src="https://github.com/user-attachments/assets/0687039e-c141-4550-9b63-66bdc08cb721" />

