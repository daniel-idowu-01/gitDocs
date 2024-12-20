# GITDOC

Gitdoc is a tool that can be used to generate comprehensive and user-friendly documentation directly from your GitHub repositories. This project aims to simplify the process of creating and maintaining project documentation, saving developers time and effort.

---

## Features

- **GitHub Integration**: Seamlessly connect your GitHub repository.
- **Automated Documentation**: Generate documentation based on code comments, markdown files, and repository structure.
- **Interactive Dashboard**: Admin dashboard to manage users, projects, and system performance.
- **Error Handling**: Provides detailed logs for failed documentation generation tasks.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: MongoDB
- **Integration**: GitHub API

---

## Installation

### Prerequisites

1. Node.js and npm installed.
2. MongoDB instance running locally or in the cloud.
3. A GitHub account and personal access token.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/daniel-idowu-01/gitDocs
   cd gitDocs
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   ```
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```env
   NODE_ENV=test
   PORT=3000
   MONGO_DB=your_mongo_connection_string
   GITHUB_TOKEN=your_personal_access_token
   GEMINI_API_KEY=gemini_api_key
   SALT=test
   JWT_SECRET=jwtsecret
   EMAIL_JWT_SECRET=emailjwtsecret
   GITHUB_CLIENT_ID=clientid
   GITHUB_CLIENT_SECRET-clientsecret
   PASSPORT_SECRET=secret
   BASE_URL=base_url
   FRONTEND_URL=frontend_url
   COOKIE_NAME=cookie
   ```

4. Start the app:
   ```bash
   cd server
   npm run dev
   ```
   ```bash
   cd client
   npm run dev
   ```
---

## Roadmap

- [ ] Add support for GitLab and Bitbucket.
- [ ] Introduce AI-powered summarization for code.
- [ ] Enhance customization options for generated documentation.
- [ ] Provide multi-language support for projects.
- [ ] Add user subscription plans.

---

## Contributing

We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support:

- Email: danielidowu414@gmail.com
