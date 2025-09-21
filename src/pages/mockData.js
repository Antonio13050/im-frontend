// mockData.js
export const mockUser = {
    id: 3,
    full_name: "João Silva",
    perfil: "gerente",
    gerente_id: 1,
};

export const mockUsers = [
    {
        id: "2",
        full_name: "Gerente João",
        email: "joao@imobi.com",
        telefone: "123456789",
        perfil: "gerente",
        ativo: true,
        gerenteId: null, // Gerentes não têm gerenteId
    },
    {
        id: "3",
        full_name: "Corretor Maria",
        email: "maria@imobi.com",
        telefone: "987654321",
        perfil: "corretor",
        ativo: true,
        gerenteId: "1", // Associado ao Gerente João
    },
    {
        id: "4",
        full_name: "Corretor Pedro",
        email: "pedro@imobi.com",
        telefone: "456789123",
        perfil: "corretor",
        ativo: false,
        gerenteId: "2", // Associado ao Gerente João
    },
    {
        id: "5",
        full_name: "Gerente Ana",
        email: "ana@imobi.com",
        telefone: "321654987",
        perfil: "gerente",
        ativo: true,
        gerenteId: null,
    },
    {
        id: "6",
        full_name: "Corretor Lucas",
        email: "lucas@imobi.com",
        telefone: "654321987",
        perfil: "corretor",
        ativo: true,
        gerenteId: "5", // Associado ao Gerente Ana
    },
];

export const mockImoveis = [
    {
        id: 1,
        corretor_id: 1,
        status: "disponivel",
        preco: 500000,
        titulo: "Apartamento Centro",
        created_date: "2025-09-15T10:00:00Z", // ISO date string
    },
    {
        id: 2,
        corretor_id: 2,
        status: "vendido",
        preco: 300000,
        titulo: "Casa Jardim",
        created_date: "2025-09-14T12:00:00Z",
    },
    {
        id: 3,
        corretor_id: 2,
        status: "alugado",
        preco: 2000,
        titulo: "Kitnet Vila Nova",
        created_date: "2025-09-13T15:00:00Z",
    },
    {
        id: 4,
        corretor_id: 3,
        status: "disponivel",
        preco: 750000,
        titulo: "Sobrado Luxo",
        created_date: "2025-09-12T09:00:00Z",
    },
    {
        id: 5,
        corretor_id: 1,
        status: "reservado",
        preco: 600000,
        titulo: "Apartamento Praia",
        created_date: "2025-09-11T14:00:00Z",
    },
];

export const mockClientes = [
    {
        id: 1,
        corretor_id: 1,
        nome: "Cliente A",
        created_date: "2025-09-16T08:00:00Z", // ISO date string
    },
    {
        id: 2,
        corretor_id: 2,
        nome: "Cliente B",
        created_date: "2025-09-15T14:00:00Z",
    },
    {
        id: 3,
        corretor_id: 2,
        nome: "Cliente C",
        created_date: "2025-09-14T16:00:00Z",
    },
    {
        id: 4,
        corretor_id: 3,
        nome: "Cliente D",
        created_date: "2025-09-13T10:00:00Z",
    },
];
