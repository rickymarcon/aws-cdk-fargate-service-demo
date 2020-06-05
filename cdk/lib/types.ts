declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      GITHUB_TOKEN: string;
      SERVICE_ID: string;
      REPO_OWNER: string;
      REPO_NAME: string;
      BRANCH: string;
    }
  }
}

// Convert into a module by adding an empty export statement
export {};
