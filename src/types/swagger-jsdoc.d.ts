declare module 'swagger-jsdoc' {
  interface SwaggerJsdocOptions {
    definition?: Record<string, unknown>;
    apis?: string[];
    [key: string]: unknown;
  }

  function swaggerJsdoc(options: SwaggerJsdocOptions): Record<string, unknown>;

  export default swaggerJsdoc;
}