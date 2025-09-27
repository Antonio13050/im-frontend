import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatPrice = (price) =>
    price
        ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
          }).format(price)
        : "N/A";

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);

    let date;
    if (isDateOnly) {
        const [year, month, day] = dateString.split("-").map(Number);
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return "N/A";

    return format(date, "dd/MM/yyyy", { locale: ptBR });
};

export const formatCpfCnpj = (value) => {
    if (!value) return "N/A";

    const digits = value.replace(/\D/g, "");

    if (digits.length === 11) {
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    if (digits.length === 14) {
        return digits.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            "$1.$2.$3/$4-$5"
        );
    }

    return value;
};

export const formatTelefone = (value) => {
    if (!value) return "N/A";

    const digits = value.replace(/\D/g, "");

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return value;
};
