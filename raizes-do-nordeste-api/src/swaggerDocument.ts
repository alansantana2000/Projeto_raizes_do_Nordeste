export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Raízes do Nordeste",
    version: "1.0.0",
    description: "Documentação interativa da API de autoatendimento multicanal."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        summary: "Autenticar utilizador",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@exemplo.com" },
                  senha: { type: "string", example: "123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Login bem-sucedido" },
          "401": { description: "Credenciais inválidas" }
        }
      }
    },
    "/produtos": {
      get: {
        summary: "Listar o cardápio público",
        tags: ["Produtos"],
        responses: {
          "200": { description: "Lista de produtos retornada com sucesso" }
        }
      }
    },
    "/pedidos": {
      post: {
        summary: "Criar um novo pedido",
        tags: ["Pedidos"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  canalPedido: { type: "string", example: "APP" },
                  usuarioId: { type: "integer", example: 1 },
                  itens: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        produtoId: { type: "integer", example: 1 },
                        quantidade: { type: "integer", example: 2 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Pedido criado com sucesso" },
          "400": { description: "Canal inválido ou erro de requisição" }
        }
      }
    }
  }
};