import React, { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DataHealthCard = memo(({ title, count, icon: Icon, color }) => (
    <Card className={`border-l-4 ${color}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
            />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground">
                {count > 0 ? "Requer atenção" : "Tudo certo!"}
            </p>
        </CardContent>
    </Card>
));

DataHealthCard.displayName = "DataHealthCard";
export default DataHealthCard;
