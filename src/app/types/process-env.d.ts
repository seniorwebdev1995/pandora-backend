declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Prevent to use process.env directly.
      // Use the ConfigService instead with transformed and validated values.
      [key: string]: never;
    }
  }
}

export {};
