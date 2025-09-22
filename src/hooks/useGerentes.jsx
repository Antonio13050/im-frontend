import { useMemo } from "react";

export const useGerentes = (allUsers) => {
    return useMemo(() => {
        return allUsers
            ? allUsers.filter((u) => u.roles[0].nome === "GERENTE")
            : [];
    }, [allUsers]);
};
