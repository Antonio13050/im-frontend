import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatPrice = (price) =>
    price
        ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
          }).format(price)
        : "N/A";

export const formatDate = (dateString) =>
    dateString
        ? format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
        : "N/A";
