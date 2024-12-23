## Contributing

- Comment under an issue you want to be assigned to.
- Create a New branch from `staging` with your name and the feature you are working on. for example
  `adedoyin/hero-section`.
- Make sure you do a rebase or pull before making your pull request back to `staging`.
- On your pull request, refrence the issue you worked on by mentioning the issue number or url you worked on.

  
Contributions to this repository can be made via pull requests on GitHub to the Staging Branch. When opening a PR, please tag
[@Adedoyin13](https://github.com/Adedoyin13).


#### Server

- Express
- Mongoose
- JWT (For authentication)
- bcryptjs (for data encryption)

- make sure to uncheck the clone only main branch when you fork my repo, so you can clone all branches in the repo

follow this step :
In your terminal, 
cd Desktop 
git clone <repo link>
cd Express-Tracker
git status
git checkout -b "your branch name"
code .

whenever you want to push to github:
git add --all
git status
git commit -m "commit-name"
git push origin "your branch name"

```
MONGO_URI = 
JWT_SECRET = 
SMTP_HOST = 
SMTP_PORT = 
SMTP_USER = 
SMTP_PASS = 

```

To start the server
```
$ cd server
$ npm install (to install server-side dependencies)
& npm run dev (to start the server)
```